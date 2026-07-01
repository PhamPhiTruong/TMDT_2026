package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface StoreRepository extends JpaRepository<Store, Integer> {

    Optional<Store> findByOwnerUserId(Integer userId);

    boolean existsByOwnerUserId(Integer userId);

    Optional<Store> findByUrl(String url);

}