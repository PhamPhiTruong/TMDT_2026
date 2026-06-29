package nlu.tmdt.dryfood_myapp.service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import nlu.tmdt.dryfood_myapp.dto.request.user.CreateUserRequest;
import nlu.tmdt.dryfood_myapp.dto.response.UserResponse;
import nlu.tmdt.dryfood_myapp.entity.User;
import nlu.tmdt.dryfood_myapp.exception.AppException;
import nlu.tmdt.dryfood_myapp.exception.ErrorCode;
import nlu.tmdt.dryfood_myapp.mapper.UserMapper;
import nlu.tmdt.dryfood_myapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;

    public UserResponse createUser(CreateUserRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = userMapper.toEntity(request);

        // convert date string -> LocalDate (nếu cần)
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        }

        user.setStatus("ACTIVE");

        User saved = userRepository.save(user);

        return userMapper.toResponse(saved);
    }
}