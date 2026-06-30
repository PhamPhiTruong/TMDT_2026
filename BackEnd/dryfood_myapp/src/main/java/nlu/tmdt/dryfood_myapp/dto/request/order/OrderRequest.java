package nlu.tmdt.dryfood_myapp.dto.request.order;

import lombok.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private String fullName;
    private String phone;
    private String address;
    private String note;
    private String paymentMethod;
}