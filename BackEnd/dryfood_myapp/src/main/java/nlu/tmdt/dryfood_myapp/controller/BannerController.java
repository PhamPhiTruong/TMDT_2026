package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.banner.CreateBannerRequest;
import nlu.tmdt.dryfood_myapp.dto.request.banner.UpdateBannerRequest;
import nlu.tmdt.dryfood_myapp.dto.response.BannerResponse;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import nlu.tmdt.dryfood_myapp.service.BannerService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/store/banners")
@RequiredArgsConstructor
public class BannerController {
    private final BannerService bannerService;
    private final UserRepository userRepository;

    private Integer getOwnerId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return user.getUserId();
    }

    @PreAuthorize("hasRole('STORE_OWNER')")
    @PostMapping
    public ApiResponse<BannerResponse> createBanner(Authentication authentication, @Valid @RequestBody CreateBannerRequest request) {
        Integer ownerId = getOwnerId(authentication);
        return ApiResponse.success(
                "Banner created successfully",
                bannerService.createBanner(request, ownerId));
    }

    @PreAuthorize("hasRole('STORE_OWNER')")
    @GetMapping
    public ApiResponse<List<BannerResponse>> getBanners(Authentication authentication) {
        Integer ownerId = getOwnerId(authentication);
        return ApiResponse.success(
                "Success",
                bannerService.getBanners(ownerId)
        );
    }

    @PreAuthorize("hasRole('STORE_OWNER')")
    @GetMapping("/{id}")
    public ApiResponse<BannerResponse> getBanner(Authentication authentication, @PathVariable Integer id) {
        Integer ownerId = getOwnerId(authentication);
        return ApiResponse.success(
                "Success",
                bannerService.getBanner(ownerId, id)
        );
    }

    @PreAuthorize("hasRole('STORE_OWNER')")
    @PutMapping("/{id}")
    public ApiResponse<BannerResponse> updateBanner(Authentication authentication, @PathVariable Integer id,
                                                    @Valid @RequestBody UpdateBannerRequest request) {
        Integer ownerId = getOwnerId(authentication);
        request.setBannerId(id);
        return ApiResponse.success(
                "Banner updated successfully",
                bannerService.updateBanner(request, ownerId)
        );
    }

    @PreAuthorize("hasRole('STORE_OWNER')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBanner(Authentication authentication, @PathVariable Integer id) {
        Integer ownerId = getOwnerId(authentication);
        bannerService.deleteBanner(ownerId, id);
        return ApiResponse.success(
                "Banner deleted successfully",
                null
        );
    }
}