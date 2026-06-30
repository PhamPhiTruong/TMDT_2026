package nlu.tmdt.dryfood_myapp.enums;

/**
 * Các vai trò người dùng trong hệ thống.
 * - GUEST  : Chưa đăng nhập – chỉ xem sản phẩm & Q&A
 * - USER   : Khách mua hàng đã đăng nhập
 * - STORE_OWNER : Chủ cửa hàng
 */
public enum UserRole {
    GUEST,
    USER,
    STORE_OWNER
}
