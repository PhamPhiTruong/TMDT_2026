package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nlu.tmdt.dryfood_myapp.dto.request.product.CreateProductRequest;
import nlu.tmdt.dryfood_myapp.dto.request.product.UpdateProductRequest;
import nlu.tmdt.dryfood_myapp.dto.request.product.AddProductsOnStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.ProductResponse;
import nlu.tmdt.dryfood_myapp.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/store")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {

    ProductService productService;

    // Giả lập lấy ownerId từ FE, thực tế lấy từ token/session
    private Integer getOwnerId() {
        return 2;
    }

    @PutMapping("/products/on-store")
    public ApiResponse<Void> publishProducts(@Valid @RequestBody AddProductsOnStoreRequest request) {
        productService.publishProducts(getOwnerId(), request);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Products published successfully")
                .build();
    }

    @GetMapping("/products/on-store")
    public ApiResponse<List<ProductResponse>> getProductsOnStore() {
        List<ProductResponse> responses = productService.getProductsOnStore(getOwnerId());
        return ApiResponse.<List<ProductResponse>>builder()
                .code(200)
                .data(responses)
                .build();
    }


    @PostMapping("/products")
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductResponse response = productService.createProduct(request, getOwnerId());
        return ApiResponse.<ProductResponse>builder()
                .code(200)
                .data(response)
                .build();
    }

    @GetMapping("/products")
    public ApiResponse<List<ProductResponse>> getProducts() {
        List<ProductResponse> responses = productService.getProducts(getOwnerId());
        return ApiResponse.<List<ProductResponse>>builder()
                .code(200)
                .data(responses)
                .build();
    }

    @GetMapping("/products/{id}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Integer id){
        ProductResponse response = productService.getProduct(getOwnerId(), id);
        return ApiResponse.<ProductResponse>builder()
                .code(200)
                .data(response)
                .build();
    }

    @PutMapping("/products/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Integer id, @Valid @RequestBody UpdateProductRequest request) {
        request.setProductId(id);
        ProductResponse response = productService.updateProduct(request, getOwnerId());
        return ApiResponse.<ProductResponse>builder()
                .code(200)
                .data(response)
                .build();
    }

    @DeleteMapping("/products/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(getOwnerId(), id);
        return ApiResponse.<Void>builder().build();
    }
}