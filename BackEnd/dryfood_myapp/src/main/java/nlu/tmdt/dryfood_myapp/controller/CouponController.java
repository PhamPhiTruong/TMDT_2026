package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nlu.tmdt.dryfood_myapp.dto.request.coupon.CreateCouponRequest;
import nlu.tmdt.dryfood_myapp.dto.request.coupon.UpdateCouponRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.CouponResponse;
import nlu.tmdt.dryfood_myapp.service.CouponService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/store")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CouponController {

    CouponService couponService;

    // TODO: Lấy từ SecurityContext sau khi tích hợp JWT
    private Integer getOwnerId() {
        return 1;
    }

    @PostMapping("/coupons")
    public ApiResponse<CouponResponse> createCoupon(
            @Valid @RequestBody CreateCouponRequest request) {

        return ApiResponse.<CouponResponse>builder()
                .code(200)
                .message("Coupon created successfully")
                .data(couponService.createCoupon(request, getOwnerId()))
                .build();
    }

    @GetMapping("/coupons")
    public ApiResponse<List<CouponResponse>> getCoupons() {

        return ApiResponse.<List<CouponResponse>>builder()
                .code(200)
                .message("Success")
                .data(couponService.getCoupons(getOwnerId()))
                .build();
    }

    @GetMapping("/coupons/{id}")
    public ApiResponse<CouponResponse> getCoupon(
            @PathVariable Integer id) {

        return ApiResponse.<CouponResponse>builder()
                .code(200)
                .message("Success")
                .data(couponService.getCoupon(getOwnerId(), id))
                .build();
    }

    @PutMapping("/coupons/{id}")
    public ApiResponse<CouponResponse> updateCoupon(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateCouponRequest request) {

        request.setCouponId(id);

        return ApiResponse.<CouponResponse>builder()
                .code(200)
                .message("Coupon updated successfully")
                .data(couponService.updateCoupon(request, getOwnerId()))
                .build();
    }

    @DeleteMapping("/coupons/{id}")
    public ApiResponse<Void> deleteCoupon(
            @PathVariable Integer id) {

        couponService.deleteCoupon(getOwnerId(), id);

        return ApiResponse.<Void>builder()
                .code(200)
                .message("Coupon deleted successfully")
                .build();
    }
}