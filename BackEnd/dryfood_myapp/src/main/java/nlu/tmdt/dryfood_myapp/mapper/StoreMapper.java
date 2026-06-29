package nlu.tmdt.dryfood_myapp.mapper;

import nlu.tmdt.dryfood_myapp.dto.request.store.CreateStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.request.store.UpdateStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.response.StoreResponse;
import nlu.tmdt.dryfood_myapp.entity.Store;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
@Mapper(componentModel = "spring")
public interface StoreMapper {

    @Mapping(target = "storeId", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Store toEntity(CreateStoreRequest request);

    @Mapping(source = "storeId", target = "id")
    StoreResponse toResponse(Store store);

    @Mapping(target = "storeId", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateStore(UpdateStoreRequest request, @MappingTarget Store store);
}