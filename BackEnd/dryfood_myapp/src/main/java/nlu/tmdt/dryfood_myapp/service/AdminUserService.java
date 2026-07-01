package nlu.tmdt.dryfood_myapp.service;

import lombok.RequiredArgsConstructor;
import nlu.tmdt.dryfood_myapp.dto.response.UserAdminDTO;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    public List<UserAdminDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public UserAdminDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return mapToDTO(user);
    }

    @Transactional
    public UserAdminDTO updateUserStatus(Integer id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setStatus(status);
        User updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }

    private UserAdminDTO mapToDTO(User user) {
        return UserAdminDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .userAvatar(user.getUserAvatar())
                .authProvider(user.getAuthProvider())
                .build();
    }
}
