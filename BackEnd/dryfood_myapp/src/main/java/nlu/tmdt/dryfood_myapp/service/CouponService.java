package nlu.tmdt.dryfood_myapp.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nlu.tmdt.dryfood_myapp.dto.request.coupon.CreateCouponRequest;
import nlu.tmdt.dryfood_myapp.dto.request.coupon.UpdateCouponRequest;
import nlu.tmdt.dryfood_myapp.dto.response.CouponResponse;
import nlu.tmdt.dryfood_myapp.entity.Coupon;
import nlu.tmdt.dryfood_myapp.entity.Store;
import nlu.tmdt.dryfood_myapp.enums.CouponStatus;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.mapper.CouponMapper;
import nlu.tmdt.dryfood_myapp.repository.CouponRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CouponService {

    CouponRepository couponRepository;
    CouponMapper couponMapper;
    StoreService storeService;

    public CouponResponse createCoupon(CreateCouponRequest request, Integer ownerId) {

        Store store = storeService.getStoreByOwner(ownerId);

        if (couponRepository.existsByStoreStoreIdAndCode(store.getStoreId(), request.getCode())) {
            throw new AppException(ErrorCode.COUPON_ALREADY_EXISTS);
        }
        if (request.getQuantity() <= 0) {
            throw new AppException(ErrorCode.INVALID_COUPON);
        }

        if (request.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_COUPON);
        }
        validateCoupon(request.getStartDate(), request.getEndDate());

        Coupon coupon = couponMapper.toEntity(request);
        coupon.setStore(store);
        coupon.setStatus(CouponStatus.ACTIVE);
        coupon.setUsedQuantity(0);

        Coupon saved = couponRepository.save(coupon);

        return couponMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CouponResponse> getCoupons(Integer ownerId) {

        Store store = storeService.getStoreByOwner(ownerId);

        return couponRepository.findByStoreStoreId(store.getStoreId())
                .stream()
                .map(couponMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CouponResponse getCoupon(Integer ownerId, Integer couponId) {

        Store store = storeService.getStoreByOwner(ownerId);

        Coupon coupon = couponRepository
                .findByCouponIdAndStoreStoreId(
                        couponId,
                        store.getStoreId())
                .orElseThrow(() ->
                        new AppException(ErrorCode.COUPON_NOT_FOUND));

        return couponMapper.toResponse(coupon);
    }

    public CouponResponse updateCoupon(UpdateCouponRequest request, Integer ownerId) {

        Store store = storeService.getStoreByOwner(ownerId);

        Coupon coupon = couponRepository
                .findByCouponIdAndStoreStoreId(
                        request.getCouponId(),
                        store.getStoreId())
                .orElseThrow(() ->
                        new AppException(ErrorCode.COUPON_NOT_FOUND));

        validateCoupon(request.getStartDate(), request.getEndDate());

        if (!coupon.getCode().equals(request.getCode())
                && couponRepository.existsByStoreStoreIdAndCode(store.getStoreId(), request.getCode())) {
            throw new AppException(ErrorCode.COUPON_ALREADY_EXISTS);
        }
        if (request.getQuantity() <= 0) {
            throw new AppException(ErrorCode.INVALID_COUPON);
        }
        if (request.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_COUPON);
        }

        couponMapper.updateCoupon(request, coupon);

        Coupon saved = couponRepository.save(coupon);

        return couponMapper.toResponse(saved);
    }

    public void deleteCoupon(Integer ownerId, Integer couponId) {

        Store store = storeService.getStoreByOwner(ownerId);

        Coupon coupon = couponRepository
                .findByCouponIdAndStoreStoreId(
                        couponId,
                        store.getStoreId())
                .orElseThrow(() ->
                        new AppException(ErrorCode.COUPON_NOT_FOUND));

        if (coupon.getStatus() != CouponStatus.ACTIVE) {
            throw new AppException(ErrorCode.INVALID_COUPON);
        }

        coupon.setStatus(CouponStatus.INACTIVE);

        couponRepository.save(coupon);
    }

    private void validateCoupon(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new AppException(ErrorCode.INVALID_COUPON);
        }
        if (!start.isBefore(end)) {
            throw new AppException(ErrorCode.INVALID_COUPON);
        }

    }
}