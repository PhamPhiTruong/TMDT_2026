package nlu.tmdt.dryfood_myapp.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "name", length = 150, nullable = false)
    private String name;

    @Column(name = "price_change", precision = 10, scale = 2)
    private BigDecimal priceChange;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "status", length = 50)
    private String status;
}
