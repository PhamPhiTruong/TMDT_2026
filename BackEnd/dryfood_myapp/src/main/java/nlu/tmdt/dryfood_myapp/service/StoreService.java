package nlu.tmdt.dryfood_myapp.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import nlu.tmdt.dryfood_myapp.dto.request.CreateStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.request.UpdateStoreRequest;
import nlu.tmdt.dryfood_myapp.dto.response.StoreResponse;
import nlu.tmdt.dryfood_myapp.entity.Store;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.enums.StoreStatus;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.mapper.StoreMapper;
import nlu.tmdt.dryfood_myapp.repository.StoreRepository;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreService {
    StoreRepository storeRepository;
    UserRepository userRepository;
    StoreMapper storeMapper;

    public StoreResponse createStore(CreateStoreRequest request, Integer ownerId) {
        if (storeRepository.existsByOwnerUserId(ownerId)) {
            throw new AppException(ErrorCode.STORE_ALREADY_EXISTS);
        }

        User owner = getOwner(ownerId);

        Store store = storeMapper.toEntity(request);
        store.setOwner(owner);
        store.setStatus(StoreStatus.ACTIVE.name());
        Store saved = storeRepository.save(store);
        return storeMapper.toResponse(saved);
    }

    public StoreResponse getMyStore(Integer ownerId) {
        Store store = getStore(ownerId);
        return storeMapper.toResponse(store);
    }

    public StoreResponse updateStore(UpdateStoreRequest request, Integer ownerId) {
        Store store = storeRepository.findByOwnerUserId(ownerId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

        storeMapper.updateStore(request, store);
        return storeMapper.toResponse(storeRepository.save(store));
    }

    private User getOwner(Integer ownerId){
        return userRepository.findById(ownerId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private Store getStore(Integer ownerId){
        return storeRepository.findByOwnerUserId(ownerId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
    }
}