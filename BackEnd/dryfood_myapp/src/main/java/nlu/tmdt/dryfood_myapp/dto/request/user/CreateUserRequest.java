package nlu.tmdt.dryfood_myapp.dto.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateUserRequest {

    @NotBlank(message = "USERNAME_REQUIRED")
    @Size(min = 3, max = 150)
    String username;

    @NotBlank(message = "PASSWORD_REQUIRED")
    @Size(min = 6, max = 255)
    String password;

    @NotBlank(message = "EMAIL_REQUIRED")
    @Email(message = "INVALID_EMAIL")
    String email;

    @Size(max = 150)
    String fullName;

    String dateOfBirth;

    String gender;

    @Pattern(regexp = "^(ADMIN|USER|SELLER)$", message = "INVALID_ROLE")
    String role;

    String userAvatar;

    @Pattern(regexp = "^[0-9]{10,15}$", message = "INVALID_PHONE")
    String phone;

    String status;
}