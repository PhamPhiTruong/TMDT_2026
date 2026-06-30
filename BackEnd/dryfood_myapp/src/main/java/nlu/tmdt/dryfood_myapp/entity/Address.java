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

    // Giữ lại trường cũ để tương thích (nếu cần)
    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "receiver_name", length = 150, nullable = false)
    private String receiverName;

    @Column(name = "phone", length = 20, nullable = false)
    private String phone;

    @Column(name = "is_default")
    private Boolean isDefault;

    // === Các trường mới cho tính năng địa chỉ hoàn chỉnh ===

    // Mã tỉnh/huyện/xã để dùng với API giao vận (GHN, GHTK, ...)
    @Column(name = "province_id")
    private Integer provinceId;

    @Column(name = "district_id")
    private Integer districtId;

    @Column(name = "ward_id", length = 20)
    private String wardId;

    // Tên hiển thị lưu sẵn, tránh phụ thuộc vào API bên ngoài lúc hiển thị
    @Column(name = "province_name", length = 100)
    private String provinceName;

    @Column(name = "district_name", length = 100)
    private String districtName;

    @Column(name = "ward_name", length = 100)
    private String wardName;

    // Số nhà, tên đường
    @Column(name = "detail_address", length = 255)
    private String detailAddress;
}
