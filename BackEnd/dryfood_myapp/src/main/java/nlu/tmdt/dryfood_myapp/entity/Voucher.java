package nlu.tmdt.dryfood_myapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "vouchers")
@Data
public class Voucher {

    @Id
    @Column(name = "code", length = 50)
    private String code; // Mã voucher (Khóa chính), ví dụ: "SAVE50K"

    @Column(name = "discount_type", nullable = false, length = 20)
    private String discountType; // "PERCENTAGE" hoặc "FIXED"

    @Column(name = "discount_value", nullable = false)
    private Double discountValue; // Giá trị giảm (Ví dụ: 10 hoặc 50000)

    @Column(name = "min_order_value")
    private Double minOrderValue = 0.0; // Giá trị đơn tối thiểu

    @Column(name = "max_discount_value")
    private Double maxDiscountValue; // Giảm tối đa bao nhiêu (cho dạng %)

    @Column(name = "start_date")
    private LocalDateTime startDate; // Ngày bắt đầu có hiệu lực

    @Column(name = "end_date")
    private LocalDateTime endDate; // Ngày hết hạn

    @Column(name = "usage_limit")
    private Integer usageLimit; // Giới hạn tổng số lần dùng

    @Column(name = "used_count")
    private Integer usedCount = 0; // Số lần đã dùng thực tế

    @Column(name = "is_active")
    private Boolean isActive = true; // Trạng thái kích hoạt (true/false)
}