package nlu.tmdt.dryfood_myapp.service;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.product.CreateProductRequest;
import nlu.tmdt.dryfood_myapp.dto.request.product.UpdateProductRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ProductResponse;
import nlu.tmdt.dryfood_myapp.entity.Product;
import nlu.tmdt.dryfood_myapp.entity.ProductImage;
import nlu.tmdt.dryfood_myapp.entity.Store;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.mapper.ProductMapper;
import nlu.tmdt.dryfood_myapp.repository.ProductRepository;
import nlu.tmdt.dryfood_myapp.repository.StoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final ProductMapper productMapper;

    private Store getCurrentStore(Integer ownerId) {
        return storeRepository.findByOwnerUserId(ownerId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
    }

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request, Integer ownerId) {
        Store store = getCurrentStore(ownerId);

        Product product = productMapper.toEntity(request);
        product.setStore(store);
        product.setStatus("active");

        List<ProductImage> images = request.getImages().stream()
                .map(url -> ProductImage.builder()
                        .url(url)
                        .product(product)
                        .build())
                .collect(Collectors.toList());
        product.setImages(images);

        Product saved = productRepository.save(product);

        ProductResponse response = productMapper.toResponse(saved);
        response.setImages(
                saved.getImages().stream()
                        .map(ProductImage::getUrl)
                        .collect(Collectors.toList())
        );
        return response;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts(Integer ownerId) {
        Store store = getCurrentStore(ownerId);
        List<Product> products = productRepository.findByStoreStoreIdAndStatus(store.getStoreId(), "active");
        return products.stream().map(product -> {
            ProductResponse response = productMapper.toResponse(product);
            response.setImages(
                    product.getImages().stream()
                            .map(ProductImage::getUrl)
                            .collect(Collectors.toList())
            );
            return response;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Integer ownerId, Integer productId) {
        Store store = getCurrentStore(ownerId);
        Product product = productRepository.findByProductIdAndStoreStoreId(productId, store.getStoreId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        ProductResponse response = productMapper.toResponse(product);
        response.setImages(
                product.getImages().stream()
                        .map(ProductImage::getUrl)
                        .collect(Collectors.toList())
        );
        return response;
    }

    @Transactional
    public ProductResponse updateProduct(UpdateProductRequest request, Integer ownerId) {
        Store store = getCurrentStore(ownerId);
        Product product = productRepository.findByProductIdAndStoreStoreId(request.getProductId(), store.getStoreId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        productMapper.updateProduct(request, product);

        // Xử lý ảnh: xóa hết, thêm mới
        product.getImages().clear();
        request.getImages().forEach(url -> {
            ProductImage image = ProductImage.builder()
                    .url(url)
                    .product(product)
                    .build();
            product.getImages().add(image);
        });

        Product saved = productRepository.save(product);
        ProductResponse response = productMapper.toResponse(saved);
        response.setImages(
                saved.getImages().stream()
                        .map(ProductImage::getUrl)
                        .collect(Collectors.toList())
        );
        return response;
    }

    @Transactional
    public void deleteProduct(Integer ownerId, Integer productId) {
        Store store = getCurrentStore(ownerId);
        Product product = productRepository.findByProductIdAndStoreStoreId(productId, store.getStoreId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setStatus("inactive");
        productRepository.save(product);
    }
}