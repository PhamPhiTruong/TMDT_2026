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
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import nlu.tmdt.dryfood_myapp.service.ProductService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/store")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('STORE_OWNER')")
public class ProductController {

    ProductService productService;
    UserRepository userRepository;

    private Integer getOwnerId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return user.getUserId();
    }

    @PutMapping("/products/on-store")
    public ApiResponse<Void> publishProducts(Authentication authentication, @Valid @RequestBody AddProductsOnStoreRequest request) {
        productService.publishProducts(getOwnerId(authentication), request);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Products published successfully")
                .build();
    }

    @GetMapping("/products/on-store")
    public ApiResponse<List<ProductResponse>> getProductsOnStore(Authentication authentication) {
        List<ProductResponse> responses = productService.getProductsOnStore(getOwnerId(authentication));
        return ApiResponse.<List<ProductResponse>>builder()
                .code(200)
                .data(responses)
                .build();
    }


    @PostMapping("/products")
    public ApiResponse<ProductResponse> createProduct(Authentication authentication, @Valid @RequestBody CreateProductRequest request) {
        ProductResponse response = productService.createProduct(request, getOwnerId(authentication));
        return ApiResponse.<ProductResponse>builder()
                .code(200)
                .data(response)
                .build();
    }

    @GetMapping("/products")
    public ApiResponse<List<ProductResponse>> getProducts(Authentication authentication) {
        List<ProductResponse> responses = productService.getProducts(getOwnerId(authentication));
        return ApiResponse.<List<ProductResponse>>builder()
                .code(200)
                .data(responses)
                .build();
    }

    @GetMapping("/products/{id}")
    public ApiResponse<ProductResponse> getProduct(Authentication authentication, @PathVariable Integer id){
        ProductResponse response = productService.getProduct(getOwnerId(authentication), id);
        return ApiResponse.<ProductResponse>builder()
                .code(200)
                .data(response)
                .build();
    }

    @PutMapping("/products/{id}")
    public ApiResponse<ProductResponse> updateProduct(Authentication authentication, @PathVariable Integer id, @Valid @RequestBody UpdateProductRequest request) {
        request.setProductId(id);
        ProductResponse response = productService.updateProduct(request, getOwnerId(authentication));
        return ApiResponse.<ProductResponse>builder()
                .code(200)
                .data(response)
                .build();
    }

    @DeleteMapping("/products/{id}")
    public ApiResponse<Void> deleteProduct(Authentication authentication, @PathVariable Integer id) {
        productService.deleteProduct(getOwnerId(authentication), id);
        return ApiResponse.<Void>builder().build();
    }
}