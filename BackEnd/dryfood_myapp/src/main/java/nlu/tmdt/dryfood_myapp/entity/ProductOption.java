package nlu.tmdt.dryfood_myapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

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

    @Column(name = "quantity", nullable = false)
    private Integer quantity;           // ← Đảm bảo không null

    @Column(name = "status", length = 50)
    private String status;

    // ==================== HELPER METHODS ====================

    /**
     * Kiểm tra còn hàng không
     */
    public boolean isAvailable() {
        return "ACTIVE".equals(status) && quantity != null && quantity > 0;
    }

    /**
     * Kiểm tra đủ số lượng yêu cầu
     */
    public boolean hasEnoughStock(int requestedQuantity) {
        return quantity != null && quantity >= requestedQuantity;
    }

    /**
     * Giá cuối cùng = giá gốc + priceChange
     */
    public BigDecimal getFinalPrice(BigDecimal basePrice) {
        if (priceChange == null) return basePrice;
        return basePrice.add(priceChange);
    }
}