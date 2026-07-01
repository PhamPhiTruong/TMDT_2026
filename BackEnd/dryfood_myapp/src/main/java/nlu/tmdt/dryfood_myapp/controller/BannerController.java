package nlu.tmdt.dryfood_myapp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.request.banner.CreateBannerRequest;
import nlu.tmdt.dryfood_myapp.dto.request.banner.UpdateBannerRequest;
import nlu.tmdt.dryfood_myapp.dto.response.BannerResponse;
import nlu.tmdt.dryfood_myapp.dto.response.ApiResponse;
import nlu.tmdt.dryfood_myapp.service.BannerService;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/store/banners")
@RequiredArgsConstructor
public class BannerController {
    private final BannerService bannerService;



    @PostMapping
    public ApiResponse<BannerResponse> createBanner(@Valid @RequestBody CreateBannerRequest request) {
        Integer ownerId = 1; // TODO: lấy từ Security
        return ApiResponse.success(
                "Banner created successfully",
                bannerService.createBanner(request, ownerId));
    }

    @GetMapping
    public ApiResponse<List<BannerResponse>> getBanners() {
        Integer ownerId = 1;
        return ApiResponse.success(
                "Success",
                bannerService.getBanners(ownerId)
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<BannerResponse> getBanner(@PathVariable Integer id) {
        Integer ownerId = 1;
        return ApiResponse.success(
                "Success",
                bannerService.getBanner(ownerId, id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<BannerResponse> updateBanner(@PathVariable Integer id,
                                                    @Valid @RequestBody UpdateBannerRequest request) {
        Integer ownerId = 1;
        request.setBannerId(id);
        return ApiResponse.success(
                "Banner updated successfully",
                bannerService.updateBanner(request, ownerId)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBanner(@PathVariable Integer id) {
        Integer ownerId = 1;
        bannerService.deleteBanner(ownerId, id);
        return ApiResponse.success(
                "Banner deleted successfully",
                null
        );
    }
}