package nlu.tmdt.dryfood_myapp.mapper;

import nlu.tmdt.dryfood_myapp.dto.request.product.CreateProductRequest;
import nlu.tmdt.dryfood_myapp.dto.request.product.UpdateProductRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ProductResponse;
import nlu.tmdt.dryfood_myapp.entity.Product;
import nlu.tmdt.dryfood_myapp.entity.ProductImage;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "store", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toEntity(CreateProductRequest request);

    ProductResponse toResponse(Product product);

    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "store", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateProduct(UpdateProductRequest request, @MappingTarget Product product);

    default ProductImage map(String url) {
        if (url == null) {
            return null;
        }

        return ProductImage.builder()
                .url(url)
                .build();
    }

    default String map(ProductImage image) {
        return image == null ? null : image.getUrl();
    }

    @AfterMapping
    default void afterMapping(@MappingTarget Product product) {
        if (product.getImages() != null) {
            product.getImages().forEach(image -> image.setProduct(product));
        }
    }
}