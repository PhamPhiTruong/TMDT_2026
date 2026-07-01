package nlu.tmdt.dryfood_myapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReportRequest {
    @NotNull(message = "Mã cửa hàng không được để trống")
    private Integer storeId;

    @NotBlank(message = "Lý do báo cáo không được để trống")
    private String reason;
}
