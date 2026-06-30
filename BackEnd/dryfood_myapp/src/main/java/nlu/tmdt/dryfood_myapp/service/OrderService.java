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
                // .fullName(request.getFullName())
                // .phone(request.getPhone())
                // .address(request.getAddress())
                // .note(request.getNote())
                // .paymentMethod(request.getPaymentMethod())
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

    // 🌟 Xử lý cập nhật phương thức thanh toán từ trang /payment gửi sang
// 🌟 Sửa Long thành Integer ở đây
    // 🌟 Xử lý cập nhật phương thức thanh toán từ trang /payment gửi sang
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
            // Lấy email khách hàng an toàn qua mối quan hệ với User (hoặc fallback về mail mặc định nếu user chưa có mail)
            String customerEmail = (order.getUser() != null && order.getUser().getEmail() != null)
                    ? order.getUser().getEmail()
                    : "22130142@st.hcmuaf.edu.vn"; // Dùng chính mail bạn cấu hình để test nhanh

            // SỬA LỖI: Chuyển đổi BigDecimal từ Order sang Double để truyền vào EmailService
            Double finalAmount = order.getTotalPrice() != null ? order.getTotalPrice().doubleValue() : 0.0;

            // Tiến hành bắn thư ngầm (Không lo lỗi đỏ nữa nhé!)
            try {
                emailService.sendOrderConfirmationEmail(customerEmail, orderId, finalAmount, order.getStatus());
            } catch (Exception e) {
                // Log lại lỗi nếu mail gặp sự cố hệ thống để tránh làm sập luồng đổi trạng thái đơn của khách
                System.err.println("❌ Lỗi gửi email: " + e.getMessage());
            }

            return true;
        }

        return false;
    }
    public void saveOtpToOrder(Integer orderId, String otpCode, String paymentMethod) {
        // Tìm đơn hàng trong DB
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

        // Cập nhật thông tin mã OTP và phương thức thanh toán vào Entity Order
        // ⚠️ Lưu ý: Bạn cần thêm trường 'otpCode' và 'paymentMethod' vào file Order.java nếu chưa có
        order.setOtpCode(otpCode);
        order.setPaymentMethod(paymentMethod);
        order.setStatus("AWAITING_OTP"); // Đổi trạng thái đơn hàng thành chờ nhập OTP

        orderRepository.save(order);
    }

    /**
     * 2. Kiểm tra mã OTP thanh toán của khách hàng
     */
    public boolean verifyPaymentOtp(Integer orderId, String inputOtp) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng để xác thực!"));

        // Đối soát mã OTP nhập vào với mã OTP lưu trong Database
        if (order.getOtpCode() != null && order.getOtpCode().equals(inputOtp)) {

            // Nếu đúng: Cập nhật trạng thái đơn hàng tùy theo phương thức thanh toán
            if ("COD".equalsIgnoreCase(order.getPaymentMethod())) {
                order.setStatus("PENDING_SHIP"); // Chờ giao hàng
            } else {
                order.setStatus("PAID"); // Đã thanh toán (áp dụng cho QR Bank/MoMo)
            }

            // Xóa mã OTP đi sau khi xác thực thành công để bảo mật
            order.setOtpCode(null);
            orderRepository.save(order);

            return true;
        }

        return false;
    }
    @Value("${momo.partner.code}") private String partnerCode;
    @Value("${momo.access.key}") private String accessKey;
    @Value("${momo.secret.key}") private String secretKey;
    @Value("${momo.api.url}") private String momoApiUrl;
    @Value("${momo.redirect.url}") private String redirectUrl;
    @Value("${momo.notify.url}") private String notifyUrl;

    public String createMoMoPaymentUrl(Integer orderId, Long amount) {
        // Bộ key Sandbox mặc định của MoMo
        String partnerCode = "MOMOBKUN20180529";
        String accessKey = "klm05663944177542732";
        String secretKey = "at Apr 11 17:15:05 ICT 2018";
        String momoApiUrl = "https://test-payment.momo.vn/v2/gateway/api/create";

        String requestId = String.valueOf(System.currentTimeMillis());
        // 🌟 ĐỔI: Bỏ dấu gạch dưới phức tạp, dùng chuỗi số liền mạch cho mã đơn hàng
        String orderIdStr = "NLSTORE" + orderId + "T" + requestId;

        // 🌟 ĐỔI: Loại bỏ hoàn toàn ký tự đặc biệt '#' để tránh lỗi mã hóa URL (URL Encoding)
        String orderInfo = "Thanh toan don hang " + orderId + " tai Nong Lam Store";
        String requestType = "captureWallet";
        String extraData = "";

        String cleanNotifyUrl = "http://localhost:8081/api/v1/orders/momo-ipn";
        String cleanRedirectUrl = "http://localhost:3000/order-success";

        // 1. Sắp xếp chuỗi raw theo đúng thứ tự Alphabet nghiêm ngặt của MoMo:
        // accessKey -> amount -> extraData -> ipnUrl -> orderId -> orderInfo -> partnerCode -> redirectUrl -> requestId -> requestType
        String rawHash = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + cleanNotifyUrl +
                "&orderId=" + orderIdStr +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + cleanRedirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        try {
            // 2. Ký chữ ký điện tử
            String signature = MoMoSecurity.signHmacSHA256(rawHash, secretKey);

            // 3. Chuẩn bị Body JSON gửi lên MoMo
            Map<String, Object> body = new HashMap<>();
            body.put("partnerCode", partnerCode);
            body.put("accessKey", accessKey);
            body.put("requestId", requestId);
            body.put("amount", amount);
            body.put("orderId", orderIdStr);
            body.put("orderInfo", orderInfo);
            body.put("redirectUrl", cleanRedirectUrl);
            body.put("ipnUrl", cleanNotifyUrl);
            body.put("extraData", extraData);
            body.put("requestType", requestType);
            body.put("signature", signature);
            body.put("lang", "vi");

            // 4. Bắn Request sang hệ thống MoMo
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> response = restTemplate.postForObject(momoApiUrl, body, Map.class);

            if (response != null && response.containsKey("payUrl")) {
                return (String) response.get("payUrl");
            } else {
                throw new RuntimeException("MoMo tu choi: " + response.get("message"));
            }
        } catch (Exception e) {
            throw new RuntimeException("Loi tao lien ket MoMo: " + e.getMessage());
        }
    }
}