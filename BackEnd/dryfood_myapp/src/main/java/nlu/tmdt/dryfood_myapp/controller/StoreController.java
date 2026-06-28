package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nlu.tmdt.dryfood_myapp.dto.request.CreateStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.request.UpdateStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.dto.response.StoreResponse;
import nlu.tmdt.dryfood_myapp.service.StoreService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/store")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreController {

    StoreService storeService;

    @PostMapping("/profile")
    public ApiResponse<StoreResponse> createStore(@Valid @RequestBody CreateStoreRequest request) {

        Integer ownerId = 1; // TODO: lấy từ Security

        return ApiResponse.<StoreResponse>builder()
                .code(200)
                .message("Store created successfully")
                .data(storeService.createStore(request, ownerId))
                .build();
    }

    @GetMapping("/profile")
    public ApiResponse<StoreResponse> getMyStore() {
        Integer ownerId = 1; // TODO: lấy từ Security
        return ApiResponse.<StoreResponse>builder()
                .code(200)
                .message("Success")
                .data(storeService.getMyStore(ownerId))
                .build();
    }

    @PutMapping("/profile")
    public ApiResponse<StoreResponse> updateStore(@Valid @RequestBody UpdateStoreRequest request) {
        Integer ownerId = 1; // TODO: lấy từ Security
        return ApiResponse.<StoreResponse>builder()
                .code(200)
                .message("Store updated successfully")
                .data(storeService.updateStore(request, ownerId))
                .build();
    }
}

