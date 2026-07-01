package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.Product;
import nlu.tmdt.dryfood_myapp.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByStoreStoreIdAndStatus(Integer storeId, ProductStatus status);

    Optional<Product> findByProductIdAndStoreStoreIdAndStatus(Integer productId, Integer storeId, ProductStatus status);

    Optional<Product> findByProductIdAndStoreStoreId(Integer productId, Integer storeId);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p WHERE p.status = :status AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchPublicProducts(@org.springframework.data.repository.query.Param("keyword") String keyword, @org.springframework.data.repository.query.Param("status") ProductStatus status);

    Optional<Product> findByProductIdAndStatus(Integer productId, ProductStatus status);
}