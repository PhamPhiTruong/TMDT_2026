package nlu.tmdt.dryfood_myapp.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

/**
 * DTO chứa thông tin phân quyền của User sau khi đăng nhập.
 * Được nhúng vào LoginResponse và trả về qua API /api/v1/users/me.
 *
 * Frontend đọc mảng `roles` để ẩn/hiện Dashboard quản lý:
 *   - ["ROLE_USER"]        → giao diện khách mua hàng
 *   - ["ROLE_STORE_OWNER"] → hiện thêm Dashboard quản lý shop
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserAccessDTO {

    /** ID người dùng */
    private Integer userId;

    /** Email (subject của JWT) */
    private String email;

    /** Họ tên hiển thị */
    private String fullName;

    /** Avatar URL */
    private String avatar;

    /**
     * Danh sách vai trò theo chuẩn Spring Security (có tiền tố ROLE_).
     * Ví dụ: ["ROLE_USER"] hoặc ["ROLE_STORE_OWNER"]
     */
    private List<String> roles;
}
