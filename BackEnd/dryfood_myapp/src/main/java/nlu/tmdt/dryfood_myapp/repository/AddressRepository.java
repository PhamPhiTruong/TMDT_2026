package nlu.tmdt.dryfood_myapp.repository;

import nlu.tmdt.dryfood_myapp.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

    List<Address> findByUser_UserId(Integer userId);

    Optional<Address> findByAddressIdAndUser_UserId(Integer addressId, Integer userId);

    long countByUser_UserId(Integer userId);

    Optional<Address> findFirstByUser_UserIdAndIsDefaultTrue(Integer userId);

    /**
     * Bỏ mặc định tất cả địa chỉ của user (dùng trước khi set mặc định mới).
     */
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.userId = :userId")
    void clearDefaultByUserId(@Param("userId") Integer userId);
}
