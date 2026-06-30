package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.StoreBanner;
import nlu.tmdt.dryfood_myapp.enums.StoreStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreBannerRepository extends JpaRepository<StoreBanner, Integer> {
    List<StoreBanner> findByStoreStoreIdAndStatus(Integer storeId, StoreStatus status);

    Optional<StoreBanner> findByBannerIdAndStoreStoreId(Integer bannerId, Integer storeId);

    Optional<StoreBanner> findByBannerIdAndStoreStoreIdAndStatus(Integer bannerId, Integer storeId, StoreStatus status);

}
