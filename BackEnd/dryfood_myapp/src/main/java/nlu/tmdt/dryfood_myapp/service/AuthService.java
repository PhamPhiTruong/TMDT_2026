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
    private final EmailService emailService; // Tiêm EmailService vào luồng Auth phục vụ OTP

    /** Đăng ký tài khoản mới + Gửi mã OTP xác thực */
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        String fullName = request.getHo().trim() + " " + request.getTen().trim();

        // 1. Tạo mã OTP ngẫu nhiên gồm 6 chữ số
        String otpCode = String.format("%06d", new Random().nextInt(1000000));

        // 2. Lưu User tạm thời với trạng thái PENDING_VERIFY và đính kèm mã OTP vào Entity
        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getMatKhau()))
                .fullName(fullName)
                .phone(request.getSoDienThoai())
                .role("USER")
                .status("PENDING_VERIFY") // Chờ xác thực OTP
                .otpCode(otpCode)         // Lưu OTP tạm xuống DB để đối chiếu sau này
                .build();

        userRepository.save(user);

        // 3. Gọi EmailService bắn OTP sang mail của khách hàng
        emailService.sendOtpEmail(user.getEmail(), otpCode);
    }

    /** Chức năng xác thực mã OTP để kích hoạt tài khoản */
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

        // Chặn không cho đăng nhập nếu tài khoản chưa được xác thực OTP
        if ("PENDING_VERIFY".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt! Vui lòng xác thực mã OTP gửi qua email.");
        }

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