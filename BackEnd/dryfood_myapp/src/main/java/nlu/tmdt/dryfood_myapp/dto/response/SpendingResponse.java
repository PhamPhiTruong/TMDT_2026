package nlu.tmdt.dryfood_myapp.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpendingResponse {
    private BigDecimal totalSpent;       // Tổng số tiền tích lũy đã tiêu
    private long totalOrders;            // Tổng số đơn hàng thành công
    private Map<String, BigDecimal> monthlySpending; // Tiền tiêu theo từng tháng (Ví dụ: "2026-05": 500000)
}