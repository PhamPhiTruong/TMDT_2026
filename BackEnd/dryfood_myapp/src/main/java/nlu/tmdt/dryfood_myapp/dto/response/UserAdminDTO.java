package nlu.tmdt.dryfood_myapp.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminDTO {
    private Integer userId;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private String status;
    private String userAvatar;
    private String authProvider;
}
