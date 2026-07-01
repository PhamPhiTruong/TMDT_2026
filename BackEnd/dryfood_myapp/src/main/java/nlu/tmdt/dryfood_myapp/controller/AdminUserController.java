package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.UserStatusUpdateRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.UserAdminDTO;
import nlu.tmdt.dryfood_myapp.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserAdminDTO>>> getAllUsers() {
        List<UserAdminDTO> users = adminUserService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách người dùng thành công", users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserAdminDTO>> getUserById(@PathVariable Integer id) {
        UserAdminDTO user = adminUserService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết người dùng thành công", user));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<UserAdminDTO>> updateUserStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UserStatusUpdateRequest request) {
        UserAdminDTO updatedUser = adminUserService.updateUserStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái người dùng thành công", updatedUser));
    }
}
