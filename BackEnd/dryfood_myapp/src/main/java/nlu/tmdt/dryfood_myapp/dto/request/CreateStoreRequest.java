package nlu.tmdt.dryfood_myapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateStoreRequest {

    @NotBlank(message = "STORE_NAME_REQUIRED")
    @Size(max = 255)
    private String name;

    @Size(max = 500)
    private String description;

    @NotBlank
    private String url;

    @Pattern(
            regexp = "^[0-9]{10,15}$",
            message = "INVALID_PHONE"
    )
    private String phone;
}