package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    java.util.List<Product> findByStoreStoreIdAndStatus(
            Integer storeId,
            String status
    );

    java.util.Optional<Product> findByProductIdAndStoreStoreId(
            Integer productId,
            Integer storeId
    );
}
