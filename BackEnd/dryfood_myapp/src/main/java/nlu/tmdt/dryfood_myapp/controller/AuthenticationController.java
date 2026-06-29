package nlu.tmdt.dryfood_myapp.controller;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.GoogleTokenRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.LoginResponse;
import nlu.tmdt.dryfood_myapp.service.GoogleAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final GoogleAuthService googleAuthService;

    /**
     * POST /api/auth/google
     * Body: { code }  ← Authorization Code nhận từ Google OAuth2
     */
    @PostMapping("/google")
    public ResponseEntity<ApiResponse<LoginResponse>> googleLogin(
            @RequestBody GoogleTokenRequest request) {

        LoginResponse data = googleAuthService.authenticateGoogleUser(request.getCode());
        String message = data.isNewUser()
                ? "Tạo tài khoản mới từ Google thành công"
                : "Đăng nhập bằng Google thành công";

        return ResponseEntity.ok(ApiResponse.success(message, data));
    }
}
