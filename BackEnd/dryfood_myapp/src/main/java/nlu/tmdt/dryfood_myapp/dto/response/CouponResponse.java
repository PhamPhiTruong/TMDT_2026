package nlu.tmdt.dryfood_myapp.dto.response;

import lombok.*;
import nlu.tmdt.dryfood_myapp.enums.CouponStatus;
import nlu.tmdt.dryfood_myapp.enums.DiscountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponResponse {

    private Integer couponId;

    private String code;

    private DiscountType discountType;

    private BigDecimal discountValue;

    private BigDecimal minOrderAmount;

    private BigDecimal maxDiscountAmount;

    private Integer quantity;

    private Integer usedQuantity;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private CouponStatus status;
}