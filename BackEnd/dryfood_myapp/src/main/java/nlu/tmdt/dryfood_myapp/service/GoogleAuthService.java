package nlu.tmdt.dryfood_myapp.service;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.response.LoginResponse;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import nlu.tmdt.dryfood_myapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;              // ← inject JwtUtil thay vì MOCK
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    private static final String GOOGLE_TOKEN_URL    = "https://oauth2.googleapis.com/token";
    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    public LoginResponse authenticateGoogleUser(String code) {
        // 1. Đổi Authorization Code lấy Google Access Token
        String googleAccessToken = fetchGoogleAccessToken(code);

        // 2. Lấy thông tin user từ Google
        Map<String, Object> googleProfile = fetchGoogleProfile(googleAccessToken);
        String email   = (String) googleProfile.get("email");
        String name    = (String) googleProfile.get("name");
        String picture = (String) googleProfile.get("picture");

        if (email == null) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }

        // 3. Tìm hoặc tạo user
        Optional<User> userOptional = userRepository.findByEmail(email);
        boolean isNewUser = false;
        User user;

        if (userOptional.isEmpty()) {
            // Email chưa tồn tại → tự động tạo tài khoản mới
            user = User.builder()
                    .username(email)
                    .password(BCrypt.hashpw(UUID.randomUUID().toString(), BCrypt.gensalt()))
                    .email(email)
                    .fullName(name)
                    .userAvatar(picture)
                    .role("USER")
                    .status("active")
                    .build();
            userRepository.save(user);
            isNewUser = true;
        } else {
            // Email đã tồn tại → đăng nhập bình thường
            user = userOptional.get();
        }

        // 4. Tạo JWT thật (bỏ MOCK hoàn toàn)
        return LoginResponse.builder()
                .accessToken(jwtUtil.generateAccessToken(user.getEmail(), user.getRole()))
                .refreshToken(jwtUtil.generateRefreshToken(user.getEmail()))
                .isNewUser(isNewUser)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatar(user.getUserAvatar())
                .role(user.getRole())
                .build();
    }

    private String fetchGoogleAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code",          code);
        body.add("client_id",     clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri",  redirectUri);
        body.add("grant_type",    "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(GOOGLE_TOKEN_URL, request, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return (String) response.getBody().get("access_token");
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        throw new AppException(ErrorCode.BAD_REQUEST);
    }

    private Map<String, Object> fetchGoogleProfile(String googleAccessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(googleAccessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    GOOGLE_USERINFO_URL,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }
        throw new AppException(ErrorCode.BAD_REQUEST);
    }
}
