package nlu.tmdt.dryfood_myapp.controller;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.PaymentRequest;
import nlu.tmdt.dryfood_myapp.dto.request.order.OrderRequest;
import nlu.tmdt.dryfood_myapp.dto.response.SpendingResponse;
import nlu.tmdt.dryfood_myapp.entity.Order;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.service.EmailService;
import nlu.tmdt.dryfood_myapp.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController

@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin("*") // Chống lỗi chặn kết nối CORS từ Next.js Frontend toàn diện
public class OrderController {

    private final OrderService orderService;
    private final EmailService emailService;
    // 1. Endpoint xử lý lập đơn hàng tạm thời (Customer Order) & giữ kho
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
        // Giả lập lấy User đang đăng nhập hệ thống (bằng Token)
        // Bạn có thể sửa lại inject User theo đúng cấu hình Security (Authentication) của nhóm mình nha
        User mockUser = new User();
        mockUser.setUserId(1); // Để tạm ID = 1 để test chạy luồng trước

        Order newOrder = orderService.placeOrder(mockUser, request);
        return ResponseEntity.ok(newOrder);
    }

    // 2. Endpoint lấy thống kê số liệu chi tiêu tích lũy theo tháng của khách hàng
    @GetMapping("/spending-analytics")
    public ResponseEntity<?> getMySpending() {
        // Ép cứng giả lập User số 1 để test tính năng nhảy số dữ liệu
        User mockUser = new User();
        mockUser.setUserId(1);

        SpendingResponse analytics = orderService.getSpendingAnalytics(mockUser);
        return ResponseEntity.ok(analytics);
    }

    // 3a. ENDPOINT 1: Khách bấm thanh toán -> Sinh OTP và gửi qua mail
    @PostMapping("/{orderId}/payment-request")
    public ResponseEntity<?> requestPaymentOtp(
            @PathVariable Integer orderId,
            @RequestBody PaymentRequest paymentRequest) {
        try {
            // Lấy thông tin số tiền của đơn hàng từ DB (Giả lập đơn hàng có giá trị là 250000)
            Long orderAmount = 250000L;

            // 🌟 NẾU LÀ PHƯƠNG THỨC MOMO: Gọi service tạo link và trả về ngay, không gửi OTP Mail nữa
            if ("MOMO".equalsIgnoreCase(paymentRequest.getPaymentMethod())) {
                String payUrl = orderService.createMoMoPaymentUrl(orderId, orderAmount);
                return ResponseEntity.ok(Map.of(
                        "status", "REDIRECT",
                        "payUrl", payUrl
                ));
            }

            // --- GIỮ NGUYÊN LUỒNG CŨ CHO COD VÀ BANK_TRANSFER (YÊU CẦU OTP) ---
            String otpCode = String.format("%06d", new java.util.Random().nextInt(1000000));
            orderService.saveOtpToOrder(orderId, otpCode, paymentRequest.getPaymentMethod());
            String customerEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            emailService.sendOtpEmail(customerEmail, otpCode);

            return ResponseEntity.ok(Map.of(
                    "status", "PENDING_OTP",
                    "message", "Mã OTP xác thực thanh toán đã được gửi vào email của bạn!"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    // 3b. ENDPOINT 2: Khách nhập OTP từ giao diện -> Xác thực chốt đơn
    @PostMapping("/{orderId}/payment-verify")
    public ResponseEntity<?> verifyPaymentOtp(
            @PathVariable Integer orderId,
            @RequestParam String otpCode) {
        try {
            // 🌟 Bạn bổ sung hàm verifyPaymentOtp trong OrderService để check mã OTP lưu trong đơn hàng
            boolean isSuccess = orderService.verifyPaymentOtp(orderId, otpCode);

            if (isSuccess) {
                return ResponseEntity.ok(Map.of(
                        "status", "SUCCESS",
                        "message", "Xác thực OTP thành công! Đơn hàng đã được thanh toán."
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Mã OTP không chính xác hoặc đã hết hạn!"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getMessage()));
        }
    }
}