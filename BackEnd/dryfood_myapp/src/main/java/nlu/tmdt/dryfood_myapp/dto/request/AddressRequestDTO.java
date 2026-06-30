package nlu.tmdt.dryfood_myapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequestDTO {

    @NotBlank(message = "Tên người nhận không được để trống")
    @Size(max = 150, message = "Tên người nhận tối đa 150 ký tự")
    private String contactName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(\\+84|0)[3-9]\\d{8}$",
             message = "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)")
    private String phone;

    // Mã tỉnh/huyện/xã để khớp với API giao vận (GHN, GHTK, ...)
    private Integer provinceId;
    private Integer districtId;
    private String wardId;

    // Tên hiển thị tỉnh/huyện/xã (lưu trực tiếp để tránh phụ thuộc vào API bên ngoài)
    private String provinceName;
    private String districtName;
    private String wardName;

    @Size(max = 255, message = "Địa chỉ cụ thể tối đa 255 ký tự")
    private String detailAddress;

    private Boolean isDefault = false;
}
