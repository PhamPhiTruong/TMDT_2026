package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}