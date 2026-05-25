package nlu.tmdt.dryfood_myapp.entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "username", length = 150, nullable = false, unique = true)
    private String username;

    @Column(name = "password", length = 255, nullable = false)
    private String password;

    @Column(name = "email", length = 150, nullable = false)
    private String email;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender", length = 50)
    private String gender;

    @Column(name = "role", length = 50)
    private String role;

    @Column(name = "user_avatar", length = 255)
    private String userAvatar;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "status", length = 50)
    private String status;
}
