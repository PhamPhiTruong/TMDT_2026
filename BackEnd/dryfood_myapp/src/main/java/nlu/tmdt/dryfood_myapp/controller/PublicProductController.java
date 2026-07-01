package nlu.tmdt.dryfood_myapp.controller;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.PublicProductResponse;
import nlu.tmdt.dryfood_myapp.service.PublicProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final PublicProductService publicProductService;

    @GetMapping
    public ApiResponse<List<PublicProductResponse>> searchProducts(@RequestParam(required = false, defaultValue = "") String keyword) {
        List<PublicProductResponse> responses = publicProductService.searchProducts(keyword);
        return ApiResponse.<List<PublicProductResponse>>builder()
                .code(200)
                .data(responses)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<PublicProductResponse> getProductDetails(@PathVariable Integer id) {
        PublicProductResponse response = publicProductService.getProductDetails(id);
        return ApiResponse.<PublicProductResponse>builder()
                .code(200)
                .data(response)
                .build();
    }
}
