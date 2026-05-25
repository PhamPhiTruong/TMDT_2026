package nlu.tmdt.dryfood_myapp.exception;

public class BadRequestException extends AppException {
    public BadRequestException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
