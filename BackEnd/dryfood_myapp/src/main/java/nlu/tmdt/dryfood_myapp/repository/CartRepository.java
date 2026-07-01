package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {


    Optional<Cart> findByUser_UserId(Integer userId);
}