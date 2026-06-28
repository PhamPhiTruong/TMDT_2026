package nlu.tmdt.dryfood_myapp.exception;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import lombok.Getter;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
@RequiredArgsConstructor

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1003, "User not found", HttpStatus.NOT_FOUND),
    RESOURCE_NOT_FOUND(1004, "Resource not found", HttpStatus.NOT_FOUND),
    UNAUTHORIZED(1005, "Unauthorized access", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(1006, "Access denied", HttpStatus.FORBIDDEN),
    BAD_REQUEST(1007, "Bad request", HttpStatus.BAD_REQUEST),
    INTERNAL_SERVER_ERROR(1008, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    VALIDATION_ERROR(1009, "Validation failed", HttpStatus.BAD_REQUEST),

    // Store
    STORE_ALREADY_EXISTS(2001, "Store already exists for this user", HttpStatus.CONFLICT),
    STORE_NOT_FOUND(2002, "Store not found", HttpStatus.NOT_FOUND),
    FORBIDDEN_STORE_ACCESS(2003, "You do not have permission to access this store", HttpStatus.FORBIDDEN),
    STORE_NAME_INVALID(2004, "Store name is invalid", HttpStatus.BAD_REQUEST),
    STORE_PHONE_INVALID(2005, "Store phone is invalid", HttpStatus.BAD_REQUEST),

    // Product
    PRODUCT_NOT_FOUND(3001, "Product not found", HttpStatus.NOT_FOUND),
    INVALID_PRODUCT(3002, "Invalid product", HttpStatus.BAD_REQUEST),

    // Banner
    BANNER_NOT_FOUND(4001, "Banner not found", HttpStatus.NOT_FOUND)
    ;

    int code;
    String message;
    HttpStatus httpStatus;

}
