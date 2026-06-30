package nlu.tmdt.dryfood_myapp.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.AddToCartRequest;
import nlu.tmdt.dryfood_myapp.dto.response.CartItemResponse;
import nlu.tmdt.dryfood_myapp.dto.response.CartResponse;
import nlu.tmdt.dryfood_myapp.entity.Cart;
import nlu.tmdt.dryfood_myapp.entity.CartItem;
import nlu.tmdt.dryfood_myapp.entity.Product;
import nlu.tmdt.dryfood_myapp.repository.CartItemRepository;
import nlu.tmdt.dryfood_myapp.repository.CartRepository;
import nlu.tmdt.dryfood_myapp.repository.ProductRepository;
import nlu.tmdt.dryfood_myapp.service.CartService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    private final Integer MOCK_USER_ID = 1;

    @Override
    public void addToCart(AddToCartRequest request) {

        Cart cart = cartRepository.findByUser_UserId(MOCK_USER_ID)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem existingItem = cartItemRepository
                .findByCart_CartIdAndProduct_ProductId(
                        cart.getCartId(),
                        product.getProductId()
                )
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(
                    existingItem.getQuantity() + request.getQuantity()
            );

            cartItemRepository.save(existingItem);
            return;
        }

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(request.getQuantity());
        item.setPrice(product.getPrice());
        item.setStatus("ACTIVE");

        cartItemRepository.save(item);
    }

    @Override
    public void deleteItem(Integer cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Override
    public void clearCart() {
        cartItemRepository.deleteAll();
    }

    @Override
    public CartResponse getCartDetails() {

        Cart cart = cartRepository.findByUser_UserId(MOCK_USER_ID)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> items = cartItemRepository.findAll()
                .stream()
                .filter(i ->
                        i.getCart() != null &&
                                i.getCart().getCartId().equals(cart.getCartId())
                )
                .toList();

        List<CartItemResponse> result = new ArrayList<>();
        BigDecimal grandTotal = BigDecimal.ZERO;

        for (CartItem i : items) {

            BigDecimal price = i.getPrice();
            if (price == null) {
                price = BigDecimal.ZERO;
            }

            BigDecimal total = price.multiply(
                    BigDecimal.valueOf(i.getQuantity())
            );

            CartItemResponse dto = CartItemResponse.builder()
                    .cartItemId(i.getCartItemId())
                    .productId(i.getProduct().getProductId())
                    .productName(i.getProduct().getName())
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

    @Override
    public void updateQuantity(Integer cartItemId, Integer quantity) {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found: " + cartItemId));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return;
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }
}