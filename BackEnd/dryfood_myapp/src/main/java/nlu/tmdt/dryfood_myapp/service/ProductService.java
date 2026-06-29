package nlu.tmdt.dryfood_myapp.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nlu.tmdt.dryfood_myapp.dto.request.product.AddProductsOnStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.request.product.CreateProductRequest;
import nlu.tmdt.dryfood_myapp.dto.request.product.UpdateProductRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ProductResponse;
import nlu.tmdt.dryfood_myapp.entity.Product;
import nlu.tmdt.dryfood_myapp.entity.ProductImage;
import nlu.tmdt.dryfood_myapp.entity.Store;
import nlu.tmdt.dryfood_myapp.entity.StoreProduct;
import nlu.tmdt.dryfood_myapp.enums.ProductStatus;
import nlu.tmdt.dryfood_myapp.enums.StoreStatus;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.mapper.ProductMapper;
import nlu.tmdt.dryfood_myapp.repository.ProductRepository;
import nlu.tmdt.dryfood_myapp.repository.StoreProductRepository;
import nlu.tmdt.dryfood_myapp.repository.StoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {

    ProductRepository productRepository;
    StoreRepository storeRepository;
    StoreProductRepository storeProductRepository;
    ProductMapper productMapper;

    private Store getCurrentStore(Integer ownerId) {
        return storeRepository.findByOwnerUserId(ownerId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
    }

    @Transactional
    public void publishProducts(Integer ownerId, AddProductsOnStoreRequest request) {
        Store store = getCurrentStore(ownerId);
        List<Integer> productIds = request.getProductIds();
        if (productIds == null || productIds.isEmpty()) return;

        List<StoreProduct> toSave = productIds.stream()
                .distinct()
                .map(productId -> {
                    Product product = productRepository.findByProductIdAndStoreStoreId(productId, store.getStoreId())
                            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_IN_STORE));
                    if (product.getStatus() != ProductStatus.ACTIVE) {
                        throw new AppException(ErrorCode.INVALID_PRODUCT);
                    }
                    boolean exists = storeProductRepository.existsByStoreStoreIdAndProductProductId(store.getStoreId(), productId);
                    if (exists) {
                        throw new AppException(ErrorCode.PRODUCT_ALREADY_ON_STORE);
                    }
                    return StoreProduct.builder()
                            .store(store)
                            .product(product)
                            .status(StoreStatus.ACTIVE)
                            .build();
                })
                .toList();

        if (!toSave.isEmpty()) {
            storeProductRepository.saveAll(toSave);
        }
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsOnStore(Integer ownerId) {
        Store store = getCurrentStore(ownerId);
        List<StoreProduct> storeProducts = storeProductRepository.findByStoreStoreIdAndStatus(store.getStoreId(), StoreStatus.ACTIVE);
        return storeProducts.stream()
                .map(StoreProduct::getProduct)
                .filter(product -> product.getStatus() == ProductStatus.ACTIVE)
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request, Integer ownerId) {
        Store store = getCurrentStore(ownerId);

        Product product = productMapper.toEntity(request);
        product.setStore(store);
        product.setStatus(ProductStatus.ACTIVE);

        List<ProductImage> images = request.getImages().stream()
                .map(url -> ProductImage.builder()
                        .url(url)
                        .product(product)
                        .build())
                .toList();
        product.setImages(images);

        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProducts(Integer ownerId) {
        Store store = getCurrentStore(ownerId);
        List<Product> products = productRepository.findByStoreStoreIdAndStatus(store.getStoreId(), ProductStatus.ACTIVE);
        return products.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Integer ownerId, Integer productId) {
        Store store = getCurrentStore(ownerId);
        Product product = productRepository.findByProductIdAndStoreStoreIdAndStatus(productId, store.getStoreId(), ProductStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(UpdateProductRequest request, Integer ownerId) {
        Store store = getCurrentStore(ownerId);
        Product product = productRepository.findByProductIdAndStoreStoreIdAndStatus(request.getProductId(), store.getStoreId(), ProductStatus.ACTIVE)
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
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteProduct(Integer ownerId, Integer productId) {
        Store store = getCurrentStore(ownerId);
        Product product = productRepository.findByProductIdAndStoreStoreIdAndStatus(productId, store.getStoreId(), ProductStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = productMapper.toResponse(product);
        response.setImages(
                product.getImages() == null
                        ? List.of()
                        : product.getImages()
                        .stream()
                        .map(ProductImage::getUrl)
                        .toList()
        );
        return response;
    }
}