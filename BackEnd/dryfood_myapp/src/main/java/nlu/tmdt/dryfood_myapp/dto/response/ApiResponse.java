package nlu.tmdt.dryfood_myapp.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
<<<<<<< Updated upstream
@JsonInclude(JsonInclude.Include.NON_NULL)
=======
>>>>>>> Stashed changes
public class ApiResponse<T> {

    private int code;
    private String message;
<<<<<<< Updated upstream
    private T data; // Thống nhất dùng 'data' thay cho 'result' để khớp với toàn bộ Controller mới
=======
    private T data;
>>>>>>> Stashed changes

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .code(200)
                .message(message)
                .data(data)
                .build();
    }
<<<<<<< Updated upstream
=======

    public static <T> ApiResponse<T> success(String message) {
        return success(message, null);
    }
>>>>>>> Stashed changes
}