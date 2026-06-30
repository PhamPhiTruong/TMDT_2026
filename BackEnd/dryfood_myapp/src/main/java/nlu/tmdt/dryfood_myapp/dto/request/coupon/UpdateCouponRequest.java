package nlu.tmdt.dryfood_myapp.dto.request.coupon;

import jakarta.validation.constraints.*;
import lombok.*;
import nlu.tmdt.dryfood_myapp.enums.DiscountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCouponRequest {

    private Integer couponId;

    @NotBlank
    private String code;

    @NotNull
    private DiscountType discountType;

    @NotNull
    @Positive
    private BigDecimal discountValue;

    @PositiveOrZero
    private BigDecimal minOrderAmount;

    @Positive
    private BigDecimal maxDiscountAmount;

    @NotNull
    @Positive
    private Integer quantity;

    @NotNull
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime endDate;
}