package nlu.tmdt.dryfood_myapp.entity;

import jakarta.persistence.*;
import lombok.*;
import nlu.tmdt.dryfood_myapp.enums.StoreStatus;

@Entity
@Table(name = "store_banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreBanner extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_id")
    private Integer bannerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "image_url", length = 255, nullable = false)
    private String imageUrl;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "link_url", length = 255)
    private String linkUrl;

    @Column(name = "position")
    private Integer position;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private StoreStatus status;
}
