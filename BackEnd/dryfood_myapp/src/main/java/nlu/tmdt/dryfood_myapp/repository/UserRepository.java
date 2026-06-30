package nlu.tmdt.dryfood_myapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository; // <-- Thêm import này
import org.springframework.stereotype.Repository;

import nlu.tmdt.dryfood_myapp.entity.User;

/**
 * UserRepository
 */
@Repository
// Sửa dòng dưới này: thêm "extends JpaRepository<User, Long>" 
// (Thay Long bằng kiểu dữ liệu của thuộc tính @Id trong class User của bạn, ví dụ String, Integer...)
public interface UserRepository extends JpaRepository<User, Integer> {

    public Optional<User> findByEmail(String email);

    // Bạn có thể XÓA hoặc COMMENT dòng public void save(User user); này đi
    // Vì JpaRepository đã tích hợp sẵn hàm save(T entity) rồi, không cần viết lại nữa.
}