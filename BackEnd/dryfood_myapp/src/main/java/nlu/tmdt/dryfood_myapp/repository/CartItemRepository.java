package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    // Method quan trọng này đang thiếu
    Optional<CartItem> findByCart_CartIdAndProduct_ProductIdAndProductOptionId(
            Integer cartId, Integer productId, Integer productOptionId);

    List<CartItem> findByCart_CartId(Integer cartId);

    void deleteAllByCart_CartId(Integer cartId);
}