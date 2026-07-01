package nlu.tmdt.dryfood_myapp.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.response.PublicProductResponse;
import nlu.tmdt.dryfood_myapp.entity.Product;
import nlu.tmdt.dryfood_myapp.entity.ProductImage;
import nlu.tmdt.dryfood_myapp.enums.ProductStatus;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.repository.ProductRepository;
import nlu.tmdt.dryfood_myapp.service.PublicProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicProductServiceImpl implements PublicProductService {

    private final ProductRepository productRepository;

    @Override
    public List<PublicProductResponse> searchProducts(String keyword) {
        String searchKey = keyword != null ? keyword : "";
        List<Product> products = productRepository.searchPublicProducts(searchKey, ProductStatus.ACTIVE);
        return products.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public PublicProductResponse getProductDetails(Integer productId) {
        Product product = productRepository.findByProductIdAndStatus(productId, ProductStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return mapToResponse(product);
    }

    private PublicProductResponse mapToResponse(Product product) {
        return PublicProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .status(product.getStatus().name())
                .images(product.getImages().stream().map(ProductImage::getUrl).collect(Collectors.toList()))
                .storeId(product.getStore().getStoreId())
                .storeName(product.getStore().getName())
                .build();
    }
}
