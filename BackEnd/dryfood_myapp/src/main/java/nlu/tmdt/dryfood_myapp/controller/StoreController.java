package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nlu.tmdt.dryfood_myapp.dto.request.store.CreateStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.request.store.UpdateStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.StoreResponse;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import nlu.tmdt.dryfood_myapp.service.StoreService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Dashboard & quản lý thông tin cửa hàng.
 * Tất cả endpoint đều yêu cầu ROLE_STORE_OWNER.
 */
@RestController
@RequestMapping("/api/v1/store")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('STORE_OWNER')") // Áp dụng bảo mật cho toàn bộ controller
public class StoreController {

    StoreService storeService;
    UserRepository userRepository;

    private Integer getCurrentUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return user.getUserId();
    }

    // --- Quản lý thông tin cửa hàng (Profile) ---

    @PostMapping("/profile")
    public ApiResponse<StoreResponse> createStore(Authentication authentication, @Valid @RequestBody CreateStoreRequest request) {
        return ApiResponse.<StoreResponse>builder()
                .code(200)
                .message("Store created successfully")
                .data(storeService.createStore(request, getCurrentUserId(authentication)))
                .build();
    }

    @GetMapping("/profile")
    public ApiResponse<StoreResponse> getMyStore(Authentication authentication) {
        return ApiResponse.<StoreResponse>builder()
                .code(200)
                .message("Success")
                .data(storeService.getMyStore(getCurrentUserId(authentication)))
                .build();
    }

    @PutMapping("/profile")
    public ApiResponse<StoreResponse> updateStore(Authentication authentication, @Valid @RequestBody UpdateStoreRequest request) {
        return ApiResponse.<StoreResponse>builder()
                .code(200)
                .message("Store updated successfully")
                .data(storeService.updateStore(request, getCurrentUserId(authentication)))
                .build();
    }

    // --- Quản lý vận hành (Dashboard & Kho hàng) ---

    /**
     * GET /api/v1/store/dashboard
     * Thống kê tổng quan: doanh thu, tồn kho, đơn hàng mới, v.v.
     */
    @GetMapping("/dashboard")
    public ApiResponse<Object> getDashboard(Authentication authentication) {
        return ApiResponse.builder()
                .code(200)
                .message("Dashboard data fetched successfully")
                .data(null)
                .build();
    }

    /**
     * GET /api/v1/store/inventory
     * Quản lý kho hàng của cửa hàng hiện tại.
     */
    @GetMapping("/inventory")
    public ApiResponse<Object> getInventory(Authentication authentication) {
        return ApiResponse.builder()
                .code(200)
                .message("Danh sách kho hàng")
                .data(null)
                .build();
    }
}