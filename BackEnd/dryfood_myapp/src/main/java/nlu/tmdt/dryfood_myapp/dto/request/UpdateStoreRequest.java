package nlu.tmdt.dryfood_myapp.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateStoreRequest {
    String name;
    String url;
    String phone;
    String description;
}