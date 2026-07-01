package nlu.tmdt.dryfood_myapp.service;

import nlu.tmdt.dryfood_myapp.dto.response.PublicProductResponse;
import java.util.List;

public interface PublicProductService {
    List<PublicProductResponse> searchProducts(String keyword);
    PublicProductResponse getProductDetails(Integer productId);
}
