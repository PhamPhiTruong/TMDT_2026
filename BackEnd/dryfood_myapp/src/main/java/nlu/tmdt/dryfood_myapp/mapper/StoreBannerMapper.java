package nlu.tmdt.dryfood_myapp.mapper;

import nlu.tmdt.dryfood_myapp.dto.request.banner.CreateBannerRequest;
import nlu.tmdt.dryfood_myapp.dto.request.banner.UpdateBannerRequest;
import nlu.tmdt.dryfood_myapp.dto.response.BannerResponse;
import nlu.tmdt.dryfood_myapp.entity.StoreBanner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StoreBannerMapper {

    @Mapping(target = "bannerId", ignore = true)
    @Mapping(target = "store", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    StoreBanner toEntity(CreateBannerRequest request);

    @Mapping(source = "bannerId", target = "id")
    BannerResponse toResponse(StoreBanner banner);

    @Mapping(target = "bannerId", ignore = true)
    @Mapping(target = "store", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateBanner(UpdateBannerRequest request,
                      @MappingTarget StoreBanner banner);
}
