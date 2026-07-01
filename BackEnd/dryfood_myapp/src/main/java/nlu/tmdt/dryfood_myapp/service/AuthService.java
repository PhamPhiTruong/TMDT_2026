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
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService; // Tiêm vào để sau này dùng OTP cho thanh toán

    /** Đăng ký tài khoản mới - Vào thẳng trạng thái active */
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        String fullName = request.getHo().trim() + " " + request.getTen().trim();

        // Tạo thẳng User với trạng thái active để vào thẳng hệ thống, không cần xác thực email lúc này
        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getMatKhau()))
                .fullName(fullName)
                .phone(request.getSoDienThoai())
                .role("USER")
                .status("active") // 🌟 Đã chuyển thành active mặc định
                .otpCode(null)
                .build();

        userRepository.save(user);
    }

    /** Chức năng xác thực mã OTP (Có thể giữ lại để tái sử dụng khi thanh toán hoặc reset pass) */
    @Transactional
    public boolean verifyOtp(String email, String inputOtp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin tài khoản cần xác thực!"));

        // Kiểm tra xem mã nhập vào có khớp với mã lưu trong Database không
        if (user.getOtpCode() != null && user.getOtpCode().equals(inputOtp)) {
            user.setStatus("active");
            user.setOtpCode(null); // Xác thực xong thì xóa mã OTP đi để bảo mật
            userRepository.save(user);
            return true;
        }

        throw new RuntimeException("Mã OTP không chính xác, vui lòng kiểm tra lại!");
    }

    /** Đăng nhập email/mật khẩu, trả về JWT */
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        // 🌟 Đã loại bỏ đoạn check PENDING_VERIFY để tài khoản không bị chặn ở đây nữa

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