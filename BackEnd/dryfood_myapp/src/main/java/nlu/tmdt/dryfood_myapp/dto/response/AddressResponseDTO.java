package nlu.tmdt.dryfood_myapp.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponseDTO {

    private Integer addressId;
    private String contactName;
    private String phone;

    // Mã dùng cho API giao vận
    private Integer provinceId;
    private Integer districtId;
    private String wardId;

    // Tên đã lưu sẵn
    private String provinceName;
    private String districtName;
    private String wardName;

    private String detailAddress;
    private Boolean isDefault;

    /**
     * Chuỗi địa chỉ đầy đủ, Frontend chỉ cần in ra màn hình.
     * Ví dụ: "Số 12, Đường 30/4, Phường Tân Xuân, Thị xã Đồng Xoài, Tỉnh Bình Phước"
     */
    private String fullNameAddress;
}
