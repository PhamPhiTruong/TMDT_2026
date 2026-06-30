package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.Coupon;
import nlu.tmdt.dryfood_myapp.enums.CouponStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Integer> {
    boolean existsByStoreStoreIdAndCode(Integer storeId,String code);
    List<Coupon> findByStoreStoreId(Integer storeId);
    Optional<Coupon> findByCouponIdAndStoreStoreId(Integer couponId, Integer storeId);
}