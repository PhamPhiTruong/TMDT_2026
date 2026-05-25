package nlu.tmdt.dryfood_myapp.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPayment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "payment_method", length = 50, nullable = false)
    private String paymentMethod;

    @Column(name = "total_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "currency", length = 10, nullable = false)
    private String currency;

    @Column(name = "status", length = 50, nullable = false)
    private String status;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(name = "gateway_order_id", length = 100)
    private String gatewayOrderId;

    @Column(name = "payment_address", length = 255)
    private String paymentAddress;

    @Column(name = "refund_amount", precision = 10, scale = 2)
    private BigDecimal refundAmount;

    @Column(name = "refund_reason", length = 255)
    private String refundReason;
}
