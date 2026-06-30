package nlu.tmdt.dryfood_myapp.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private boolean isNewUser;
    private String email;
    private String fullName;
    private String avatar;
    private String role;
}
