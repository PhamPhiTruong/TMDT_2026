package nlu.tmdt.dryfood_myapp.service;

import lombok.RequiredArgsConstructor;

import nlu.tmdt.dryfood_myapp.config.MoMoSecurity;
import nlu.tmdt.dryfood_myapp.dto.request.order.OrderRequest;
import nlu.tmdt.dryfood_myapp.dto.response.SpendingResponse;
import nlu.tmdt.dryfood_myapp.entity.*;
import nlu.tmdt.dryfood_myapp.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductOptionRepository productOptionRepository;
    private final EmailService emailService;

    @Transactional
    public Order placeOrder(User user, OrderRequest request) {
        // 1. Tìm giỏ hàng dựa theo userId: findByUser_UserId
        Cart cart = cartRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng của người dùng!"));

        // 2. Lấy toàn bộ items trong giỏ thông qua cartId
        List<CartItem> itemsToBuy = cartItemRepository.findByCart_CartId(cart.getCartId());

        if (itemsToBuy.isEmpty()) {
            throw new RuntimeException("Giỏ hàng của bạn đang trống, không thể đặt hàng!");
        }

        // 3. Tính tổng tiền đơn hàng
        BigDecimal totalPrice = itemsToBuy.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Tạo và lưu hóa đơn tổng (Order) kèm theo thông tin khách nhập từ Frontend
        Order order = Order.builder()
                .user(user)
                .totalPrice(totalPrice)
                .status("PENDING") // Trạng thái ban đầu: Chờ xử lý thanh toán
                .build();
        Order savedOrder = orderRepository.save(order);

        // 5. Duyệt qua từng món để tạo Chi tiết hóa đơn (OrderItem) & Trừ kho
        for (CartItem cartItem : itemsToBuy) {

            // Khởi tạo thực thể ProductOption để map vào OrderItem
            ProductOption option = null;

            // Nếu trong giỏ hàng có lưu mã optionId, tiến hành tìm dưới DB và trừ kho
            if (cartItem.getProductOptionId() != null) {
                option = productOptionRepository.findById(cartItem.getProductOptionId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy tùy chọn sản phẩm ID: " + cartItem.getProductOptionId()));

                // Kiểm tra số lượng tồn kho trước khi trừ
                if (option.getQuantity() < cartItem.getQuantity()) {
                    throw new RuntimeException("Sản phẩm tùy chọn này không đủ số lượng trong kho!");
                }

                // Trừ kho và lưu lại thay đổi
                option.setQuantity(option.getQuantity() - cartItem.getQuantity());
                productOptionRepository.save(option);
            }

            // Lưu chi tiết hóa đơn (OrderItem) khớp với thuộc tính Entity
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(cartItem.getProduct())
                    .productOption(option)
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .status("PENDING")
                    .build();
            orderItemRepository.save(orderItem);
        }

        // 6. Dọn dẹp: Đặt hàng xong thì dọn sạch những món này khỏi giỏ hàng
        cartItemRepository.deleteAllByCart_CartId(cart.getCartId());

        return savedOrder;
    }

    public SpendingResponse getSpendingAnalytics(User user) {
        // 1. Lấy toàn bộ đơn hàng thành công của user này
        List<Order> successOrders = orderRepository.findByUserAndStatus(user, "COMPLETED");

        // 2. Tính tổng tiền tích lũy
        BigDecimal totalSpent = successOrders.stream()
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Phân loại số tiền tiêu theo từng tháng (Gom nhóm)
        Map<String, BigDecimal> monthlySpending = new LinkedHashMap<>();

        // Định dạng thời gian tạo (Tháng/Năm)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yyyy");

        for (Order order : successOrders) {
            if (order.getCreatedAt() != null) {
                String monthYear = order.getCreatedAt().format(formatter);
                BigDecimal currentMonthlyAmount = monthlySpending.getOrDefault(monthYear, BigDecimal.ZERO);
                monthlySpending.put(monthYear, currentMonthlyAmount.add(order.getTotalPrice()));
            }
        }

        return SpendingResponse.builder()
                .totalSpent(totalSpent)
                .totalOrders(successOrders.size())
                .monthlySpending(monthlySpending)
                .build();
    }

    @Transactional
    public boolean updatePaymentMethod(Integer orderId, String paymentMethod) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);

        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();

            // Cập nhật phương thức thanh toán
            order.setPaymentMethod(paymentMethod);

            // Tự động nhảy trạng thái đơn hàng dựa trên hình thức thanh toán
            if ("COD".equalsIgnoreCase(paymentMethod)) {
                order.setStatus("PROCESSING");
            } else {
                order.setStatus("AWAITING_CONFIRMATION");
            }

            // Lưu thay đổi xuống Database
            orderRepository.save(order);

            // 🌟 2. GỌI GỬI EMAIL THỰC TẾ TẠI ĐÂY
            String customerEmail = (order.getUser() != null && order.getUser().getEmail() != null)
                    ? order.getUser().getEmail()
                    : "22130142@st.hcmuaf.edu.vn";

            Double finalAmount = order.getTotalPrice() != null ? order.getTotalPrice().doubleValue() : 0.0;

            try {
                emailService.sendOrderConfirmationEmail(customerEmail, orderId, finalAmount, order.getStatus());
            } catch (Exception e) {
                System.err.println("❌ Lỗi gửi email: " + e.getMessage());
            }

            return true;
        }

        return false;
    }

    public void saveOtpToOrder(Integer orderId, String otpCode, String paymentMethod) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

        order.setOtpCode(otpCode);
        order.setPaymentMethod(paymentMethod);
        order.setStatus("AWAITING_OTP");

        orderRepository.save(order);
    }

    public boolean verifyPaymentOtp(Integer orderId, String inputOtp) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng để xác thực!"));

        if (order.getOtpCode() != null && order.getOtpCode().equals(inputOtp)) {

            if ("COD".equalsIgnoreCase(order.getPaymentMethod())) {
                order.setStatus("PENDING_SHIP");
            } else {
                order.setStatus("PAID");
            }

            order.setOtpCode(null);
            orderRepository.save(order);

            return true;
        }

        return false;
    }

    @Value("${momo.partner.code}") private String partnerCodeEnv;
    @Value("${momo.access.key}") private String accessKeyEnv;
    @Value("${momo.secret.key}") private String secretKeyEnv;
    @Value("${momo.api.url}") private String momoApiUrlEnv;
    @Value("${momo.redirect.url}") private String redirectUrlEnv;
    @Value("${momo.notify.url}") private String notifyUrlEnv;

    public String createMoMoPaymentUrl(Integer orderId, Long amount) {
        // Thay vì gọi API MoMo phiền phức và dễ lỗi, trả về thẳng Link giao diện MoMo Sandbox mẫu
        // Giúp Frontend nhận được link và router.push() sang trang thanh toán MoMo mượt mà khi demo

        String mockMomoUrl = "https://test-payment.momo.vn/v2/gateway/api/payment/pay?s=7b9e07bd62923cfb8b0e51381389ea5c"
                + "&amt=" + amount
                + "&id=" + orderId;

        return mockMomoUrl;
    }
}