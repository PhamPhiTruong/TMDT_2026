package nlu.tmdt.dryfood_myapp.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private int code;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .code(200)
                .message(message)
                .data(data)
                .build();
    }

    // 🌟 GIỮ LẠI HÀM TIỆN ÍCH CỦA BẠN (Dùng khi API chỉ cần trả về message thành công)
    public static <T> ApiResponse<T> success(String message) {
        return success(message, null);
    }
}