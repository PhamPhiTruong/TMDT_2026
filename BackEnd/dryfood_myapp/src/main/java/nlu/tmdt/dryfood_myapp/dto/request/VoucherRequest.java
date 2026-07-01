package nlu.tmdt.dryfood_myapp.dto.request;

import lombok.Data;

@Data
public class VoucherRequest {
    private String code;
    private Double orderAmount;
}