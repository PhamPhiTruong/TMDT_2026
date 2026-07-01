package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.Order;
import nlu.tmdt.dryfood_myapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserAndStatus(User user, String status);
}