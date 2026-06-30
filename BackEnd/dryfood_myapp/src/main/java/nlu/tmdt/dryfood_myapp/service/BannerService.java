package nlu.tmdt.dryfood_myapp.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nlu.tmdt.dryfood_myapp.dto.request.banner.CreateBannerRequest;
import nlu.tmdt.dryfood_myapp.dto.request.banner.UpdateBannerRequest;
import nlu.tmdt.dryfood_myapp.dto.response.BannerResponse;
import nlu.tmdt.dryfood_myapp.entity.Store;
import nlu.tmdt.dryfood_myapp.entity.StoreBanner;
import nlu.tmdt.dryfood_myapp.enums.StoreStatus;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.mapper.StoreBannerMapper;
import nlu.tmdt.dryfood_myapp.repository.StoreBannerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BannerService {
    StoreBannerRepository storeBannerRepository;
    StoreBannerMapper storeBannerMapper;
    StoreService storeService;

    public BannerResponse createBanner(CreateBannerRequest request, Integer ownerId) {
        Store store = storeService.getStoreByOwner(ownerId);
        StoreBanner banner = storeBannerMapper.toEntity(request);
        banner.setStore(store);
        banner.setStatus(StoreStatus.ACTIVE);
        StoreBanner saved = storeBannerRepository.save(banner);
        return storeBannerMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> getBanners(Integer ownerId) {
        Store store = storeService.getStoreByOwner(ownerId);
        List<StoreBanner> banners = storeBannerRepository.findByStoreStoreIdAndStatus(
                store.getStoreId(), StoreStatus.ACTIVE
        );
        return banners.stream()
                .map(storeBannerMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BannerResponse getBanner(Integer ownerId, Integer bannerId) {
        Store store = storeService.getStoreByOwner(ownerId);
        StoreBanner banner = storeBannerRepository.findByBannerIdAndStoreStoreIdAndStatus(
                bannerId, store.getStoreId(), StoreStatus.ACTIVE
        ).orElseThrow(() -> new AppException(ErrorCode.BANNER_NOT_FOUND));
        return storeBannerMapper.toResponse(banner);
    }

    public BannerResponse updateBanner(UpdateBannerRequest request, Integer ownerId) {
        Store store = storeService.getStoreByOwner(ownerId);
        StoreBanner banner = storeBannerRepository.findByBannerIdAndStoreStoreIdAndStatus(
                request.getBannerId(), store.getStoreId(), StoreStatus.ACTIVE
        ).orElseThrow(() -> new AppException(ErrorCode.BANNER_NOT_FOUND));
        storeBannerMapper.updateBanner(request, banner);
        StoreBanner saved = storeBannerRepository.save(banner);
        return storeBannerMapper.toResponse(saved);
    }

    public void deleteBanner(Integer ownerId, Integer bannerId) {
        Store store = storeService.getStoreByOwner(ownerId);
        StoreBanner banner = storeBannerRepository.findByBannerIdAndStoreStoreIdAndStatus(
                bannerId, store.getStoreId(), StoreStatus.ACTIVE
        ).orElseThrow(() -> new AppException(ErrorCode.BANNER_NOT_FOUND));
        banner.setStatus(StoreStatus.INACTIVE);
        storeBannerRepository.save(banner);
    }
}