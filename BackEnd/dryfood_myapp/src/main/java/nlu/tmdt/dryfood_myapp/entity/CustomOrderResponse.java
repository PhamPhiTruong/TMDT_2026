package nlu.tmdt.dryfood_myapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "custom_order_responses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomOrderResponse extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "custom_order_id", nullable = false)
    private CustomOrder customOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "response", columnDefinition = "TEXT")
    private String response;
}
