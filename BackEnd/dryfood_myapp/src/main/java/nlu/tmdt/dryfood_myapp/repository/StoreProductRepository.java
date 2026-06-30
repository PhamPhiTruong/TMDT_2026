package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.StoreProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import nlu.tmdt.dryfood_myapp.enums.StoreStatus;

@Repository
public interface StoreProductRepository extends JpaRepository<StoreProduct, Integer> {

    boolean existsByStoreStoreIdAndProductProductId(Integer storeId, Integer productId);

    List<StoreProduct> findByStoreStoreIdAndStatus(Integer storeId, StoreStatus status);

    Optional<StoreProduct> findByStoreStoreIdAndProductProductId(Integer storeId, Integer productId);
}