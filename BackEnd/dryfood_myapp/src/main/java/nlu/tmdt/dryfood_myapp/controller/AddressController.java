package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.AddressRequestDTO;
import nlu.tmdt.dryfood_myapp.dto.response.AddressResponseDTO;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.service.AddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Quản lý địa chỉ nhận hàng của user.
 * Base URL: /api/v1/addresses
 *
 * Tất cả các endpoint đều yêu cầu xác thực JWT (Bearer token).
 * Email của user hiện tại được lấy từ SecurityContext qua Authentication.getName().
 */
@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/v1/addresses
    // Lấy danh sách tất cả địa chỉ của user đang đăng nhập
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponseDTO>>> getMyAddresses(Authentication auth) {
        List<AddressResponseDTO> addresses = addressService.getMyAddresses(auth.getName());
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách địa chỉ thành công", addresses));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/v1/addresses/{addressId}
    // Chi tiết một địa chỉ
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponseDTO>> getAddressById(
            @PathVariable Integer addressId,
            Authentication auth) {
        AddressResponseDTO dto = addressService.getAddressById(auth.getName(), addressId);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin địa chỉ thành công", dto));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/v1/addresses
    // Thêm một địa chỉ mới
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponseDTO>> addAddress(
            @Valid @RequestBody AddressRequestDTO request,
            Authentication auth) {
        AddressResponseDTO dto = addressService.addAddress(auth.getName(), request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm địa chỉ thành công", dto));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUT /api/v1/addresses/{addressId}
    // Cập nhật thông tin địa chỉ
    // ─────────────────────────────────────────────────────────────────────────
    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponseDTO>> updateAddress(
            @PathVariable Integer addressId,
            @Valid @RequestBody AddressRequestDTO request,
            Authentication auth) {
        AddressResponseDTO dto = addressService.updateAddress(auth.getName(), addressId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật địa chỉ thành công", dto));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUT /api/v1/addresses/{addressId}/default
    // Đặt địa chỉ này làm mặc định
    // ─────────────────────────────────────────────────────────────────────────
    @PutMapping("/{addressId}/default")
    public ResponseEntity<ApiResponse<AddressResponseDTO>> setDefaultAddress(
            @PathVariable Integer addressId,
            Authentication auth) {
        AddressResponseDTO dto = addressService.setDefaultAddress(auth.getName(), addressId);
        return ResponseEntity.ok(ApiResponse.success("Đặt địa chỉ mặc định thành công", dto));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE /api/v1/addresses/{addressId}
    // Xóa địa chỉ
    // ─────────────────────────────────────────────────────────────────────────
    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @PathVariable Integer addressId,
            Authentication auth) {
        addressService.deleteAddress(auth.getName(), addressId);
        return ResponseEntity.ok(ApiResponse.success("Xóa địa chỉ thành công", null));
    }
}
