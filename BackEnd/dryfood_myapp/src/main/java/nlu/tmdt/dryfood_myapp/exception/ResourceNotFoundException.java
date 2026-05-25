package nlu.tmdt.dryfood_myapp.exception;

public class ResourceNotFoundException extends AppException {
    public ResourceNotFoundException(String message) {
        super(ErrorCode.RESOURCE_NOT_FOUND);
    }
}
