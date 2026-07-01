package nlu.tmdt.dryfood_myapp.controller;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.UserAccessDTO;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;
import nlu.tmdt.dryfood_myapp.dto.request.UpdateProfileRequest;
import nlu.tmdt.dryfood_myapp.dto.response.UserProfileDTO;
import nlu.tmdt.dryfood_myapp.service.UserService;

/**
 * Các endpoint liên quan đến thông tin người dùng đang đăng nhập.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    /**
     * GET /api/v1/users/me
     * Trả về UserAccessDTO cho Frontend (roles[], avatar, ...).
     */
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'STORE_OWNER')")
    public ResponseEntity<ApiResponse<UserAccessDTO>> getMe(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        UserAccessDTO dto = UserAccessDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatar(user.getUserAvatar())
                .roles(roles)
                .build();
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin người dùng thành công", dto));
    }

    /**
     * GET /api/v1/users/profile
     * Lấy thông tin chi tiết cá nhân.
     */
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'STORE_OWNER')")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getProfile(Authentication authentication) {
        UserProfileDTO profile = userService.getUserProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin cá nhân thành công", profile));
    }

    /**
     * PUT /api/v1/users/profile
     * Cập nhật thông tin cá nhân.
     */
    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'STORE_OWNER')")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileDTO updatedProfile = userService.updateUserProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành công", updatedProfile));
    }
    /**
     * PUT /api/v1/users/password
     * Đổi mật khẩu.
     */
    @PutMapping("/password")
    @PreAuthorize("hasAnyRole('USER', 'STORE_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication,
            @Valid @RequestBody nlu.tmdt.dryfood_myapp.dto.request.ChangePasswordRequest request) {
        userService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }
}
