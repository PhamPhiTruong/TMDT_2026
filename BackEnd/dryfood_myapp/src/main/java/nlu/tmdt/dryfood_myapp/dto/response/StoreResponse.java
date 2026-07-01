package nlu.tmdt.dryfood_myapp.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreResponse {
    Integer id;
    String name;
    String description;
    String url;
    String phone;
    String status;
}