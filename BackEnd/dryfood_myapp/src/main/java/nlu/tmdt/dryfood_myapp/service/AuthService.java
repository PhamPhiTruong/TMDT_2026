package nlu.tmdt.dryfood_myapp.service;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.LoginRequest;
import nlu.tmdt.dryfood_myapp.dto.request.RegisterRequest;
import nlu.tmdt.dryfood_myapp.dto.response.LoginResponse;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import nlu.tmdt.dryfood_myapp.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /** Đăng ký tài khoản mới */
    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        String fullName = request.getHo().trim() + " " + request.getTen().trim();

        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getMatKhau()))
                .fullName(fullName)
                .phone(request.getSoDienThoai())
                .role("USER")
                .status("active")
                .authProvider("LOCAL")
                .build();

        userRepository.save(user);
    }

    /** Đăng nhập email/mật khẩu, trả về JWT */
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return LoginResponse.builder()
                .accessToken(jwtUtil.generateAccessToken(user.getEmail(), user.getRole()))
                .refreshToken(jwtUtil.generateRefreshToken(user.getEmail()))
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatar(user.getUserAvatar())
                .role(user.getRole())
                .isNewUser(false)
                .build();
    }
}
