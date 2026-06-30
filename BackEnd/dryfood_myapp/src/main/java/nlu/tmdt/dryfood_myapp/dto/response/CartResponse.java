package nlu.tmdt.dryfood_myapp.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class CartResponse {
    private List<CartItemResponse> items;
    private BigDecimal grandTotal;
}