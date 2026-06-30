package nlu.tmdt.dryfood_myapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
public class GoogleTokenRequest {

    @NotBlank(message = "Authorization code không được để trống")
    private String code;
}
