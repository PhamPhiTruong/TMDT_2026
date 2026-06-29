package nlu.tmdt.dryfood_myapp.mapper;

import nlu.tmdt.dryfood_myapp.dto.request.user.CreateUserRequest;
import nlu.tmdt.dryfood_myapp.dto.response.UserResponse;
import nlu.tmdt.dryfood_myapp.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(CreateUserRequest request);

    UserResponse toResponse(User user);
}