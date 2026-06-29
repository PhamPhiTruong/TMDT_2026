package nlu.tmdt.dryfood_myapp.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {

    Integer userId;
    String username;
    String email;
    String fullName;
    LocalDate dateOfBirth;
    String gender;
    String role;
    String userAvatar;
    String phone;
    String status;
}
