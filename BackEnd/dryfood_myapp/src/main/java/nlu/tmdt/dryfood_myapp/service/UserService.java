package nlu.tmdt.dryfood_myapp.service;

import nlu.tmdt.dryfood_myapp.dto.request.ChangePasswordRequest;
import nlu.tmdt.dryfood_myapp.dto.request.UpdateProfileRequest;
import nlu.tmdt.dryfood_myapp.dto.response.UserProfileDTO;

public interface UserService {
    UserProfileDTO getUserProfile(String email);
    UserProfileDTO updateUserProfile(String email, UpdateProfileRequest request);
    void changePassword(String email, ChangePasswordRequest request);
}
