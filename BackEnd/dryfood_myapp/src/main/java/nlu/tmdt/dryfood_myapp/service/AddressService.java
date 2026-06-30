package nlu.tmdt.dryfood_myapp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nlu.tmdt.dryfood_myapp.dto.request.AddressRequestDTO;
import nlu.tmdt.dryfood_myapp.dto.response.AddressResponseDTO;
import nlu.tmdt.dryfood_myapp.entity.Address;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.repository.AddressRepository;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressService {

    private static final int MAX_ADDRESS_PER_USER = 5;

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // GET: Danh sách địa chỉ của user đang đăng nhập
    // ─────────────────────────────────────────────────────────────────────────
    public List<AddressResponseDTO> getMyAddresses(String email) {
        User user = getUserByEmail(email);
        return addressRepository.findByUser_UserId(user.getUserId())
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET: Chi tiết một địa chỉ
    // ─────────────────────────────────────────────────────────────────────────
    public AddressResponseDTO getAddressById(String email, Integer addressId) {
        User user = getUserByEmail(email);
        Address address = getAddressOrThrow(addressId, user.getUserId());
        return toResponseDTO(address);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST: Thêm địa chỉ mới
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public AddressResponseDTO addAddress(String email, AddressRequestDTO request) {
        User user = getUserByEmail(email);

        // Kiểm tra giới hạn số địa chỉ
        long count = addressRepository.countByUser_UserId(user.getUserId());
        if (count >= MAX_ADDRESS_PER_USER) {
            throw new AppException(ErrorCode.ADDRESS_LIMIT_EXCEEDED);
        }

        // Nếu đây là địa chỉ mặc định → bỏ mặc định cũ
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.clearDefaultByUserId(user.getUserId());
        }

        // Nếu chưa có địa chỉ nào → tự động đặt làm mặc định
        boolean isFirst = (count == 0);
        boolean setDefault = isFirst || Boolean.TRUE.equals(request.getIsDefault());

        Address address = buildAddress(user, request, setDefault);
        address = addressRepository.save(address);

        log.info("User [{}] đã thêm địa chỉ mới, addressId={}", email, address.getAddressId());
        return toResponseDTO(address);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUT: Cập nhật địa chỉ
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public AddressResponseDTO updateAddress(String email, Integer addressId, AddressRequestDTO request) {
        User user = getUserByEmail(email);
        Address address = getAddressOrThrow(addressId, user.getUserId());

        // Nếu muốn đặt làm mặc định → bỏ mặc định cũ
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.clearDefaultByUserId(user.getUserId());
        }

        // Cập nhật các trường
        address.setReceiverName(request.getContactName());
        address.setPhone(request.getPhone());
        address.setProvinceId(request.getProvinceId());
        address.setDistrictId(request.getDistrictId());
        address.setWardId(request.getWardId());
        address.setProvinceName(request.getProvinceName());
        address.setDistrictName(request.getDistrictName());
        address.setWardName(request.getWardName());
        address.setDetailAddress(request.getDetailAddress());
        address.setIsDefault(Boolean.TRUE.equals(request.getIsDefault()));

        // Đồng bộ trường address (legacy) để tương thích
        address.setAddress(buildFullAddress(request.getDetailAddress(),
                request.getWardName(), request.getDistrictName(), request.getProvinceName()));

        address = addressRepository.save(address);
        log.info("User [{}] đã cập nhật địa chỉ addressId={}", email, addressId);
        return toResponseDTO(address);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUT: Đặt địa chỉ làm mặc định
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public AddressResponseDTO setDefaultAddress(String email, Integer addressId) {
        User user = getUserByEmail(email);
        Address address = getAddressOrThrow(addressId, user.getUserId());

        addressRepository.clearDefaultByUserId(user.getUserId());
        address.setIsDefault(true);
        address = addressRepository.save(address);

        log.info("User [{}] đã đặt địa chỉ mặc định, addressId={}", email, addressId);
        return toResponseDTO(address);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE: Xóa địa chỉ
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public void deleteAddress(String email, Integer addressId) {
        User user = getUserByEmail(email);
        Address address = getAddressOrThrow(addressId, user.getUserId());

        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        addressRepository.delete(address);

        // Nếu xóa đúng địa chỉ mặc định → tự động set địa chỉ còn lại đầu tiên làm mặc định
        if (wasDefault) {
            addressRepository.findByUser_UserId(user.getUserId())
                    .stream()
                    .findFirst()
                    .ifPresent(a -> {
                        a.setIsDefault(true);
                        addressRepository.save(a);
                        log.info("Tự động set địa chỉ mặc định mới, addressId={}", a.getAddressId());
                    });
        }

        log.info("User [{}] đã xóa địa chỉ addressId={}", email, addressId);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private Address getAddressOrThrow(Integer addressId, Integer userId) {
        return addressRepository.findByAddressIdAndUser_UserId(addressId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
    }

    private Address buildAddress(User user, AddressRequestDTO req, boolean isDefault) {
        String fullAddress = buildFullAddress(
                req.getDetailAddress(), req.getWardName(), req.getDistrictName(), req.getProvinceName());

        return Address.builder()
                .user(user)
                .receiverName(req.getContactName())
                .phone(req.getPhone())
                .provinceId(req.getProvinceId())
                .districtId(req.getDistrictId())
                .wardId(req.getWardId())
                .provinceName(req.getProvinceName())
                .districtName(req.getDistrictName())
                .wardName(req.getWardName())
                .detailAddress(req.getDetailAddress())
                .address(fullAddress)    // legacy field
                .isDefault(isDefault)
                .build();
    }

    /**
     * Ghép chuỗi địa chỉ đầy đủ, bỏ qua phần null/blank.
     * Ví dụ: "Số 12, Đường 30/4, Phường Tân Xuân, Thị xã Đồng Xoài, Tỉnh Bình Phước"
     */
    private String buildFullAddress(String detail, String ward, String district, String province) {
        return java.util.stream.Stream.of(detail, ward, district, province)
                .filter(s -> s != null && !s.isBlank())
                .collect(Collectors.joining(", "));
    }

    private AddressResponseDTO toResponseDTO(Address a) {
        String fullName = buildFullAddress(
                a.getDetailAddress(), a.getWardName(), a.getDistrictName(), a.getProvinceName());

        return AddressResponseDTO.builder()
                .addressId(a.getAddressId())
                .contactName(a.getReceiverName())
                .phone(a.getPhone())
                .provinceId(a.getProvinceId())
                .districtId(a.getDistrictId())
                .wardId(a.getWardId())
                .provinceName(a.getProvinceName())
                .districtName(a.getDistrictName())
                .wardName(a.getWardName())
                .detailAddress(a.getDetailAddress())
                .isDefault(a.getIsDefault())
                .fullNameAddress(fullName.isBlank() ? a.getAddress() : fullName)
                .build();
    }
}
