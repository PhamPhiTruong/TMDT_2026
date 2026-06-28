package nlu.tmdt.dryfood_myapp.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Integer productId;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer quantity;

    private String fruitType;

    private List<String> images;

    private String status;
}