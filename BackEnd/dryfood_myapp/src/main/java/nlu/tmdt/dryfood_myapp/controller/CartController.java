package nlu.tmdt.dryfood_myapp.controller;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.AddToCartRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.CartResponse;
import nlu.tmdt.dryfood_myapp.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart") // 🌟 ĐỔI: Bỏ "/v1" để khớp chính xác với cấu hình phân quyền SecurityConfig của nhóm
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ApiResponse<String> addToCart(@RequestBody AddToCartRequest request) {
        cartService.addToCart(request);
        // 🌟 ĐỔI: Dùng .success() hoặc .data() thay cho .result()
        return ApiResponse.success("Thêm vào giỏ hàng thành công", "Success");
    }

    @GetMapping("/details")
    public ApiResponse<CartResponse> getCartDetails() {
        // 🌟 ĐỔI: Chuyển sang dùng trường .data() chuẩn mới
        return ApiResponse.<CartResponse>builder()
                .code(200)
                .message("Lấy thông tin giỏ hàng thành công")
                .data(cartService.getCartDetails())
                .build();
    }

    @DeleteMapping("/delete/{cartItemId}")
    public ApiResponse<String> deleteItem(@PathVariable Integer cartItemId) {
        cartService.deleteItem(cartItemId);
        return ApiResponse.success("Xóa sản phẩm thành công", "Success");
    }

    @DeleteMapping("/clear")
    public ApiResponse<String> clearCart() {
        cartService.clearCart();
        return ApiResponse.success("Xóa sạch giỏ hàng thành công", "Success");
    }

    @PutMapping("/update/{cartItemId}")
    public ApiResponse<String> update(
            @PathVariable Integer cartItemId,
            @RequestParam Integer quantity) {
        cartService.updateQuantity(cartItemId, quantity);
        return ApiResponse.success("Cập nhật số lượng thành công", "Success");
    }
}