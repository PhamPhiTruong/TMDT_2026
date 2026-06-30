package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    Optional<CartItem> findFirstByCart_CartIdAndProduct_ProductId(Integer cartId, Integer productId);
    Optional<CartItem> findByCart_CartIdAndProduct_ProductId(Integer cartId, Integer productId);
    void deleteByCart_CartId(Integer cartId);
}