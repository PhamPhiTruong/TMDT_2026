package nlu.tmdt.dryfood_myapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Integer addressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "address", length = 255, nullable = false)
    private String address;

    @Column(name = "receiver_name", length = 150, nullable = false)
    private String receiverName;

    @Column(name = "phone", length = 20, nullable = false)
    private String phone;

    @Column(name = "is_default")
    private Boolean isDefault;
}
