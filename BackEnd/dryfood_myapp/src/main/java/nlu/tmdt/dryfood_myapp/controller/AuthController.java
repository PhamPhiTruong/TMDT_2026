package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.LoginRequest;
import nlu.tmdt.dryfood_myapp.dto.request.RegisterRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.LoginResponse;
import nlu.tmdt.dryfood_myapp.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Body: { ho, ten, soDienThoai, email, matKhau }
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(request);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .code(200)
<<<<<<< Updated upstream
                        .message("Đăng ký tài khoản thành công")
=======
                        // 🌟 CẬP NHẬT: Đổi thông báo để nhắc khách kiểm tra email nhập OTP
                        .message("Đăng ký tạm thời thành công! Vui lòng kiểm tra email để lấy mã OTP kích hoạt tài khoản.")
                        .build()
        );
    }

    /**
     * POST /api/auth/verify-otp
     * Params: email, otpCode
     * 🌟 ENDPOINT MỚI: Tiếp nhận yêu cầu kích hoạt tài khoản bằng mã OTP
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(
            @RequestParam String email,
            @RequestParam String otpCode) {

        authService.verifyOtp(email, otpCode);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .code(200)
                        .message("Kích hoạt tài khoản thành công! Bây giờ bạn đã có thể đăng nhập.")
>>>>>>> Stashed changes
                        .build()
        );
    }

    /**
     * POST /api/auth/login
     * Body: { email, password }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse data = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", data));
    }
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
