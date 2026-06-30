package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.ProductOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductOptionRepository extends JpaRepository<ProductOption, Integer> {

    // Tìm các option theo product
    List<ProductOption> findByProduct_ProductId(Integer productId);

    // Tìm option theo id và kiểm tra thuộc product nào
    Optional<ProductOption> findByIdAndProduct_ProductId(Integer id, Integer productId);

    // Tìm option còn hàng (status ACTIVE)
    List<ProductOption> findByProduct_ProductIdAndStatus(Integer productId, String status);

    // Kiểm tra tồn kho (dùng trong service)
    Optional<ProductOption> findById(Integer id);
}