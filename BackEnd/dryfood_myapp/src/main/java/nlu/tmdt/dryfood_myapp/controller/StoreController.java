package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nlu.tmdt.dryfood_myapp.dto.request.store.CreateStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.request.store.UpdateStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.StoreResponse;
import nlu.tmdt.dryfood_myapp.service.StoreService;
<<<<<<< Updated upstream
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Dashboard & quản lý thông tin cửa hàng.
 * Tất cả endpoint đều yêu cầu ROLE_STORE_OWNER.
 */
=======
import org.springframework.web.bind.annotation.*;

>>>>>>> Stashed changes
@RestController
@RequestMapping("/api/v1/store")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
<<<<<<< Updated upstream
@PreAuthorize("hasRole('STORE_OWNER')") // Áp dụng bảo mật cho toàn bộ controller
public class StoreController {

=======
public class StoreController {
>>>>>>> Stashed changes
    StoreService storeService;

    private Integer getCurrentUserId() {
        // TODO: lấy từ Spring Security
        return 2;
    }

<<<<<<< Updated upstream
    // --- Quản lý thông tin cửa hàng (Profile) ---

=======
>>>>>>> Stashed changes
    @PostMapping("/profile")
    public ApiResponse<StoreResponse> createStore(@Valid @RequestBody CreateStoreRequest request) {
        return ApiResponse.<StoreResponse>builder()
                .code(200)
                .message("Store created successfully")
                .data(storeService.createStore(request, getCurrentUserId()))
                .build();
    }

    @GetMapping("/profile")
    public ApiResponse<StoreResponse> getMyStore() {
        return ApiResponse.<StoreResponse>builder()
                .code(200)
                .message("Success")
                .data(storeService.getMyStore(getCurrentUserId()))
                .build();
    }

    @PutMapping("/profile")
    public ApiResponse<StoreResponse> updateStore(@Valid @RequestBody UpdateStoreRequest request) {
        return ApiResponse.<StoreResponse>builder()
                .code(200)
                .message("Store updated successfully")
                .data(storeService.updateStore(request, getCurrentUserId()))
                .build();
    }
<<<<<<< Updated upstream

    // --- Quản lý vận hành (Dashboard & Kho hàng từ nhánh của bạn) ---

    /**
     * GET /api/v1/store/dashboard
     * Thống kê tổng quan: doanh thu, tồn kho, đơn hàng mới, v.v.
     */
    @GetMapping("/dashboard")
    public ApiResponse<Object> getDashboard(Authentication authentication) {
        // TODO: inject thêm service hoặc dùng storeService để lọc thống kê theo getCurrentUserId()
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
        // TODO: inventoryService.getByStore(getCurrentUserId())
        return ApiResponse.builder()
                .code(200)
                .message("Danh sách kho hàng")
                .data(null)
                .build();
    }
}
=======
}
>>>>>>> Stashed changes
