package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.CreateProductRequest;
import nlu.tmdt.dryfood_myapp.dto.request.UpdateProductRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.ProductResponse;
import nlu.tmdt.dryfood_myapp.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/store")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Giả lập lấy ownerId từ FE, thực tế lấy từ token/session
    private Integer getOwnerId() {
        return 1;
    }

    @PostMapping("/products")
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductResponse response = productService.createProduct(request, getOwnerId());
        return ApiResponse.<ProductResponse>builder()
                .data(response)
                .build();
    }

    @GetMapping("/products")
    public ApiResponse<List<ProductResponse>> getProducts() {
        List<ProductResponse> responses = productService.getProducts(getOwnerId());
        return ApiResponse.<List<ProductResponse>>builder()
                .data(responses)
                .build();
    }

    @GetMapping("/product")
    public ApiResponse<ProductResponse> getProduct(@RequestParam("id") Integer productId) {
        ProductResponse response = productService.getProduct(getOwnerId(), productId);
        return ApiResponse.<ProductResponse>builder()
                .data(response)
                .build();
    }

    @PutMapping("/product")
    public ApiResponse<ProductResponse> updateProduct(@Valid @RequestBody UpdateProductRequest request) {
        ProductResponse response = productService.updateProduct(request, getOwnerId());
        return ApiResponse.<ProductResponse>builder()
                .data(response)
                .build();
    }

    @DeleteMapping("/products/delete")
    public ApiResponse<Void> deleteProduct(@RequestParam("id") Integer productId) {
        productService.deleteProduct(getOwnerId(), productId);
        return ApiResponse.<Void>builder().build();
    }
}