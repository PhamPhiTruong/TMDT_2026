package nlu.tmdt.dryfood_myapp.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import nlu.tmdt.dryfood_myapp.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity   // Bật @PreAuthorize / @PostAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // ── Preflight CORS ──────────────────────────────────────────
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ── Auth endpoints (public) ─────────────────────────────────
                        .requestMatchers(HttpMethod.POST,
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/auth/google"
                        ).permitAll()

                        // ── Guest: xem sản phẩm & Q&A ──────────────────────────────
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/questions/**").permitAll()

                        // 🌟 LUỒNG THANH TOÁN (MOMO & OTP): Cho phép USER thực hiện ──
                        .requestMatchers("/api/v1/orders/*/payment-request").hasRole("USER")
                        .requestMatchers("/api/v1/orders/*/payment-verify").hasRole("USER")

                        // 🌟 IPN WEBHOOK CỦA MOMO: Bắt buộc mở công khai (PermitAll) để Server MoMo gọi về cứu dữ liệu
                        .requestMatchers("/api/v1/orders/momo-ipn").permitAll()

                        // ── Thông tin cá nhân (USER + STORE_OWNER) ──────────────────
                        .requestMatchers("/api/v1/users/me").hasAnyRole("USER", "STORE_OWNER")

                        // ── Giỏ hàng: chỉ USER (khách mua hàng) ───────────────────
                        .requestMatchers("/api/cart/**").hasRole("USER")

                        // ── Địa chỉ: USER + STORE_OWNER đều có địa chỉ cá nhân ────
                        .requestMatchers("/api/v1/addresses/**").hasAnyRole("USER", "STORE_OWNER")

                        // ── Đặt câu hỏi: USER ───────────────────────────────────────
                        .requestMatchers(HttpMethod.POST, "/api/questions").hasRole("USER")

                        // ── Admin: Quản lý ──────────────────────────────────────────
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // ── Store Dashboard & quản lý shop: chỉ STORE_OWNER ─────────
                        .requestMatchers("/api/store/**").hasRole("STORE_OWNER")

                        // ── Trả lời Q&A với tư cách chủ shop: chỉ STORE_OWNER ───────
                        .requestMatchers(HttpMethod.POST, "/api/questions/*/answer").hasRole("STORE_OWNER")

                        // ── Mọi request còn lại phải đăng nhập ──────────────────────
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> userRepository.findByEmail(username)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole() != null ? user.getRole() : "USER")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
