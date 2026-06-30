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

/**
 * Các endpoint liên quan đến thông tin người dùng đang đăng nhập.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * GET /api/v1/users/me
     * Trả về UserAccessDTO cho Frontend (roles[], avatar, ...).
     * Yêu cầu: đã đăng nhập (USER hoặc STORE_OWNER).
     */
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'STORE_OWNER')")
    public ResponseEntity<ApiResponse<UserAccessDTO>> getMe(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        // Lấy roles từ SecurityContext (đã có tiền tố ROLE_)
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
}
