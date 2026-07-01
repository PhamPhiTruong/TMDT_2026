package nlu.tmdt.dryfood_myapp.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReportDTO {
    private Integer reportId;
    private Integer storeId;
    private String storeName;
    private String userName;
    private String userEmail;
    private String reason;
    private String status;
    private String adminReply;
    private String adminName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
