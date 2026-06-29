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

    @GetMapping("/products/{id}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Integer id){
        ProductResponse response = productService.getProduct(getOwnerId(), id);
        return ApiResponse.<ProductResponse>builder()
                .data(response)
                .build();
    }

    @PutMapping("/products/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Integer id, @Valid @RequestBody UpdateProductRequest request) {
        request.setProductId(id);
        ProductResponse response = productService.updateProduct(request, getOwnerId());
        return ApiResponse.<ProductResponse>builder()
                .data(response)
                .build();
    }

    @DeleteMapping("/products/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(getOwnerId(), id);
        return ApiResponse.<Void>builder().build();
    }
}