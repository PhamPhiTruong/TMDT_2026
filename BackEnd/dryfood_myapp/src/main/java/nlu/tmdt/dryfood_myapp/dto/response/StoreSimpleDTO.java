package nlu.tmdt.dryfood_myapp.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StoreSimpleDTO {
    private Integer storeId;
    private String name;
}
