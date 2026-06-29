package nlu.tmdt.dryfood_myapp.dto.request.product;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddProductsOnStoreRequest {

    @NotEmpty(message = "Product list cannot be empty")
    private List<Integer> productIds;

}