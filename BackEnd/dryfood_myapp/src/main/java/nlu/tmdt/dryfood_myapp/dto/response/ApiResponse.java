package nlu.tmdt.dryfood_myapp.dto.response;

public class ApiResponse<T> {
    int code;
    String message;
    T data;
}
