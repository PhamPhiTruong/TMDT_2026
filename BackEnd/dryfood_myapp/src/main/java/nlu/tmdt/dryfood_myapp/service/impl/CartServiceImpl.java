package nlu.tmdt.dryfood_myapp.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.AddToCartRequest;
import nlu.tmdt.dryfood_myapp.dto.response.CartItemResponse;
import nlu.tmdt.dryfood_myapp.dto.response.CartResponse;
import nlu.tmdt.dryfood_myapp.entity.Cart;
import nlu.tmdt.dryfood_myapp.entity.CartItem;
import nlu.tmdt.dryfood_myapp.entity.Product;
import nlu.tmdt.dryfood_myapp.entity.ProductOption;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.repository.CartItemRepository;
import nlu.tmdt.dryfood_myapp.repository.CartRepository;
import nlu.tmdt.dryfood_myapp.repository.ProductOptionRepository;
import nlu.tmdt.dryfood_myapp.repository.ProductRepository;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import nlu.tmdt.dryfood_myapp.service.CartService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductOptionRepository productOptionRepository;
    private final UserRepository userRepository;

    private final Integer MOCK_USER_ID = 1; // Sau này thay bằng user từ Security

    private Cart getOrCreateCart() {
        System.out.println("🔍 Đang tìm user ID: " + MOCK_USER_ID);

        User user = userRepository.findById(MOCK_USER_ID)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + MOCK_USER_ID));

        System.out.println("✅ Tìm thấy user: " + user.getFullName() + " (ID: " + user.getUserId() + ")");

        return cartRepository.findByUser_UserId(MOCK_USER_ID)
                .orElseGet(() -> {
                    System.out.println("🛒 Tạo giỏ hàng mới cho user ID: " + MOCK_USER_ID);
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    // =========================
    // ADD TO CART - ĐÃ CÓ KIỂM TRA TỒN KHO
    // =========================
    @Override
    public void addToCart(AddToCartRequest request) {
        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Số lượng phải lớn hơn 0");
        }

        Cart cart = getOrCreateCart();

        // Tìm sản phẩm
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        int requestedQuantity = request.getQuantity();

        // ====================== KIỂM TRA TỒN KHO ======================
        if (request.getProductOptionId() != null) {
            // Có option
            ProductOption option = productOptionRepository.findById(request.getProductOptionId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy phiên bản sản phẩm"));

            if (option.getQuantity() == null || option.getQuantity() < requestedQuantity) {
                throw new RuntimeException(
                        String.format("Sản phẩm '%s - %s' chỉ còn %d cái.",
                                product.getName(), option.getName(), option.getQuantity())
                );
            }
        } else {
            // Không có option
            if (product.getQuantity() == null || product.getQuantity() < requestedQuantity) {
                throw new RuntimeException(
                        String.format("Sản phẩm '%s' chỉ còn %d cái.",
                                product.getName(), product.getQuantity())
                );
            }
        }
        // ============================================================

        // Tìm item đã tồn tại trong giỏ
        Optional<CartItem> existingOpt = cartItemRepository
                .findByCart_CartIdAndProduct_ProductIdAndProductOptionId(
                        cart.getCartId(),
                        product.getProductId(),
                        request.getProductOptionId()
                );

        if (existingOpt.isPresent()) {
            CartItem existing = existingOpt.get();
            int newQuantity = existing.getQuantity() + requestedQuantity;

            // Kiểm tra tồn kho lần nữa khi cộng dồn
            if (request.getProductOptionId() != null) {
                ProductOption option = productOptionRepository.findById(request.getProductOptionId()).get();
                if (option.getQuantity() < newQuantity) {
                    throw new RuntimeException("Tổng số lượng vượt quá tồn kho!");
                }
            } else if (product.getQuantity() < newQuantity) {
                throw new RuntimeException("Tổng số lượng vượt quá tồn kho!");
            }

            existing.setQuantity(newQuantity);
            cartItemRepository.save(existing);
            System.out.println("🔄 Cập nhật số lượng sản phẩm trong giỏ: " + newQuantity);
        } else {
            // Thêm mới
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setProductOptionId(request.getProductOptionId());
            item.setQuantity(requestedQuantity);
            item.setPrice(product.getPrice());
            item.setStatus("ACTIVE");

            cartItemRepository.save(item);
            System.out.println("✅ Đã thêm sản phẩm mới vào giỏ hàng");
        }
    }

    // =========================
    // DELETE ITEM
    // =========================
    @Override
    public void deleteItem(Integer cartItemId) {
        cartItemRepository.deleteById(cartItemId);
        System.out.println("🗑️ Đã xóa cartItem ID: " + cartItemId);
    }

    // =========================
    // CLEAR CART
    // =========================
    @Override
    public void clearCart() {
        Cart cart = getOrCreateCart();
        cartItemRepository.deleteAllByCart_CartId(cart.getCartId());
        System.out.println("🧹 Đã xóa sạch giỏ hàng");
    }

    // =========================
    // GET CART DETAILS
    // =========================
    @Override
    public CartResponse getCartDetails() {
        Cart cart = getOrCreateCart();

        List<CartItem> items = cartItemRepository.findByCart_CartId(cart.getCartId());

        List<CartItemResponse> result = new ArrayList<>();
        BigDecimal grandTotal = BigDecimal.ZERO;

        for (CartItem i : items) {
            BigDecimal price = i.getPrice() != null ? i.getPrice() : BigDecimal.ZERO;
            BigDecimal total = price.multiply(BigDecimal.valueOf(i.getQuantity()));

            String imageUrl = null;
            if (i.getProduct().getImages() != null && !i.getProduct().getImages().isEmpty()) {
                imageUrl = i.getProduct().getImages().get(0).getUrl();
            }

            CartItemResponse dto = CartItemResponse.builder()
                    .cartItemId(i.getCartItemId())
                    .productId(i.getProduct().getProductId())
                    .productName(i.getProduct().getName())
                    .productImage(imageUrl)
                    .quantity(i.getQuantity())
                    .price(price)
                    .total(total)
                    .build();

            result.add(dto);
            grandTotal = grandTotal.add(total);
        }

        return CartResponse.builder()
                .items(result)
                .grandTotal(grandTotal)
                .build();
    }

    // =========================
    // UPDATE QUANTITY
    // =========================
    @Override
    public void updateQuantity(Integer cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return;
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        System.out.println("📝 Đã cập nhật số lượng cartItem ID: " + cartItemId);
    }
}