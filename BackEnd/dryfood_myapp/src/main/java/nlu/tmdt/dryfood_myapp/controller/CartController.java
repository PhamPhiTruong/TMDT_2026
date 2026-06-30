package nlu.tmdt.dryfood_myapp.controller;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.AddToCartRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.CartResponse;
import nlu.tmdt.dryfood_myapp.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
<<<<<<< Updated upstream
@RequestMapping("/api/cart") // 🌟 ĐỔI: Bỏ "/v1" để khớp chính xác với cấu hình phân quyền SecurityConfig của nhóm
=======
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/cart")
>>>>>>> Stashed changes
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ApiResponse<String> addToCart(@RequestBody AddToCartRequest request) {
        cartService.addToCart(request);
<<<<<<< Updated upstream
        // 🌟 ĐỔI: Dùng .success() hoặc .data() thay cho .result()
        return ApiResponse.success("Thêm vào giỏ hàng thành công", "Success");
=======

        return ApiResponse.success("Thêm vào giỏ hàng thành công", "OK");
>>>>>>> Stashed changes
    }

    @GetMapping("/details")
    public ApiResponse<CartResponse> getCartDetails() {
<<<<<<< Updated upstream
        // 🌟 ĐỔI: Chuyển sang dùng trường .data() chuẩn mới
        return ApiResponse.<CartResponse>builder()
                .code(200)
                .message("Lấy thông tin giỏ hàng thành công")
                .data(cartService.getCartDetails())
                .build();
=======

        CartResponse response = cartService.getCartDetails();

        return ApiResponse.success("Lấy giỏ hàng thành công", response);
>>>>>>> Stashed changes
    }

    @DeleteMapping("/delete/{cartItemId}")
    public ApiResponse<String> deleteItem(@PathVariable Integer cartItemId) {
        cartService.deleteItem(cartItemId);
<<<<<<< Updated upstream
        return ApiResponse.success("Xóa sản phẩm thành công", "Success");
=======

        return ApiResponse.success("Xóa sản phẩm thành công", "OK");
>>>>>>> Stashed changes
    }

    @DeleteMapping("/clear")
    public ApiResponse<String> clearCart() {
        cartService.clearCart();
<<<<<<< Updated upstream
        return ApiResponse.success("Xóa sạch giỏ hàng thành công", "Success");
=======

        return ApiResponse.success("Xóa giỏ hàng thành công", "OK");
>>>>>>> Stashed changes
    }

    @PutMapping("/update/{cartItemId}")
    public ApiResponse<String> update(
            @PathVariable Integer cartItemId,
            @RequestParam Integer quantity) {
        cartService.updateQuantity(cartItemId, quantity);
<<<<<<< Updated upstream
        return ApiResponse.success("Cập nhật số lượng thành công", "Success");
=======

        return ApiResponse.success("Cập nhật số lượng thành công", "OK");
>>>>>>> Stashed changes
    }
}