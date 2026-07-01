package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nlu.tmdt.dryfood_myapp.dto.request.coupon.CreateCouponRequest;
import nlu.tmdt.dryfood_myapp.dto.request.coupon.UpdateCouponRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.CouponResponse;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import nlu.tmdt.dryfood_myapp.service.CouponService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/store")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CouponController {

    CouponService couponService;
    UserRepository userRepository;

    private Integer getOwnerId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getUserId();
    }

    @PreAuthorize("hasRole('STORE_OWNER')")
    @PostMapping("/coupons")
    public ApiResponse<CouponResponse> createCoupon(
            @Valid @RequestBody CreateCouponRequest request,
            Authentication authentication) {

        return ApiResponse.<CouponResponse>builder()
                .code(200)
                .message("Coupon created successfully")
                .data(couponService.createCoupon(request, getOwnerId(authentication)))
                .build();
    }

    @PreAuthorize("hasRole('STORE_OWNER')")
    @GetMapping("/coupons")
    public ApiResponse<List<CouponResponse>> getCoupons(Authentication authentication) {

        return ApiResponse.<List<CouponResponse>>builder()
                .code(200)
                .message("Success")
                .data(couponService.getCoupons(getOwnerId(authentication)))
                .build();
    }

    @PreAuthorize("hasRole('STORE_OWNER')")
    @GetMapping("/coupons/{id}")
    public ApiResponse<CouponResponse> getCoupon(
            @PathVariable Integer id,
            Authentication authentication) {

        return ApiResponse.<CouponResponse>builder()
                .code(200)
                .message("Success")
                .data(couponService.getCoupon(getOwnerId(authentication), id))
                .build();
    }

    @PreAuthorize("hasRole('STORE_OWNER')")
    @PutMapping("/coupons/{id}")
    public ApiResponse<CouponResponse> updateCoupon(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateCouponRequest request,
            Authentication authentication) {

        request.setCouponId(id);

        return ApiResponse.<CouponResponse>builder()
                .code(200)
                .message("Coupon updated successfully")
                .data(couponService.updateCoupon(request, getOwnerId(authentication)))
                .build();
    }

    @PreAuthorize("hasRole('STORE_OWNER')")
    @DeleteMapping("/coupons/{id}")
    public ApiResponse<Void> deleteCoupon(
            @PathVariable Integer id,
            Authentication authentication) {

        couponService.deleteCoupon(getOwnerId(authentication), id);

        return ApiResponse.<Void>builder()
                .code(200)
                .message("Coupon deleted successfully")
                .build();
    }
}