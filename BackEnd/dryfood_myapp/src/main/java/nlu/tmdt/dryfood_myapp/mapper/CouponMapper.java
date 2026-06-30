package nlu.tmdt.dryfood_myapp.mapper;

import nlu.tmdt.dryfood_myapp.dto.request.coupon.CreateCouponRequest;
import nlu.tmdt.dryfood_myapp.dto.request.coupon.UpdateCouponRequest;
import nlu.tmdt.dryfood_myapp.dto.response.CouponResponse;
import nlu.tmdt.dryfood_myapp.entity.Coupon;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CouponMapper {

    @Mapping(target = "couponId", ignore = true)
    @Mapping(target = "store", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "usedQuantity", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Coupon toEntity(CreateCouponRequest request);

    CouponResponse toResponse(Coupon coupon);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "couponId", ignore = true)
    @Mapping(target = "store", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "usedQuantity", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateCoupon(
            UpdateCouponRequest request,
            @MappingTarget Coupon coupon
    );
}