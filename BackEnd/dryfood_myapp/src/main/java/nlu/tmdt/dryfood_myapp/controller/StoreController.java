package nlu.tmdt.dryfood_myapp.controller;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Dashboard & quản lý thông tin cửa hàng.
 *
 * Tất cả endpoint đều yêu cầu ROLE_STORE_OWNER.
 * Service layer kiểm tra thêm: shop phải thuộc về user đang đăng nhập.
 */
@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STORE_OWNER')")   // áp dụng cho toàn bộ controller
public class StoreController {

    /**
     * GET /api/store/dashboard
     * Thống kê tổng quan: doanh thu, tồn kho, đơn hàng mới, v.v.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Object>> getDashboard(Authentication authentication) {
        // TODO: inject StoreService, lọc theo shop của authentication.getName()
        return ResponseEntity.ok(ApiResponse.success("Dashboard", null));
    }

    /**
     * GET /api/store/{storeId}
     * Lấy thông tin shop của mình.
     */
    @GetMapping("/{storeId}")
    public ResponseEntity<ApiResponse<Object>> getStoreInfo(
            @PathVariable Long storeId,
            Authentication authentication) {
        // TODO: kiểm tra storeId thuộc về authentication.getName()
        return ResponseEntity.ok(ApiResponse.success("Thông tin cửa hàng", null));
    }

    /**
     * PUT /api/store/{storeId}
     * Cập nhật thông tin cửa hàng (Đông phụ trách phần này).
     * STORE_OWNER chỉ được sửa shop của CHÍNH MÌNH – service kiểm tra.
     */
    @PutMapping("/{storeId}")
    public ResponseEntity<ApiResponse<Object>> updateStoreInfo(
            @PathVariable Long storeId,
            @RequestBody Object request,
            Authentication authentication) {
        // TODO: StoreService.update(storeId, authentication.getName(), request)
        return ResponseEntity.ok(ApiResponse.success("Cập nhật cửa hàng thành công", null));
    }

    /**
     * GET /api/store/{storeId}/inventory
     * Quản lý kho hàng.
     */
    @GetMapping("/{storeId}/inventory")
    public ResponseEntity<ApiResponse<Object>> getInventory(
            @PathVariable Long storeId,
            Authentication authentication) {
        // TODO: InventoryService.getByStore(storeId, authentication.getName())
        return ResponseEntity.ok(ApiResponse.success("Danh sách kho hàng", null));
    }
}
