package nlu.tmdt.dryfood_myapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserStatusUpdateRequest {
    @NotBlank(message = "Trạng thái không được để trống")
    private String status;
}
