package nlu.tmdt.dryfood_myapp.controller;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.AddToCartRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.CartResponse;
import nlu.tmdt.dryfood_myapp.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ApiResponse<String> addToCart(@RequestBody AddToCartRequest request) {

        cartService.addToCart(request);

        return ApiResponse.<String>builder()
                .result("Success")
                .build();
    }

    @GetMapping("/details")
    public ApiResponse<CartResponse> getCartDetails() {

        return ApiResponse.<CartResponse>builder()
                .result(cartService.getCartDetails())
                .build();
    }

    @DeleteMapping("/delete/{cartItemId}")
    public ApiResponse<String> deleteItem(@PathVariable Integer cartItemId) {

        cartService.deleteItem(cartItemId);

        return ApiResponse.<String>builder()
                .result("Success")
                .build();
    }

    @DeleteMapping("/clear")
    public ApiResponse<String> clearCart() {

        cartService.clearCart();

        return ApiResponse.<String>builder()
                .result("Success")
                .build();
    }
    @PutMapping("/update/{cartItemId}")
    public ApiResponse<String> update(
            @PathVariable Integer cartItemId,
            @RequestParam Integer quantity) {

        cartService.updateQuantity(cartItemId, quantity);

        return ApiResponse.<String>builder()
                .result("Success")
                .build();
    }
}