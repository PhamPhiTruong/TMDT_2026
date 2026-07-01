package nlu.tmdt.dryfood_myapp.service;

import nlu.tmdt.dryfood_myapp.dto.request.AddToCartRequest;
import nlu.tmdt.dryfood_myapp.dto.response.CartResponse;

public interface CartService {

    void addToCart(AddToCartRequest request);

    void deleteItem(Integer cartItemId);

    void clearCart();

    CartResponse getCartDetails();

    void updateQuantity(Integer cartItemId, Integer quantity);
}