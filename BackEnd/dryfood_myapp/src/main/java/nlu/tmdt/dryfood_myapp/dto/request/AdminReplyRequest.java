package nlu.tmdt.dryfood_myapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminReplyRequest {
    @NotBlank(message = "Nội dung phản hồi không được để trống")
    private String response;
}
