package com.example.employee_management.service;

import com.example.employee_management.dto.ProfileResponseDto;
import com.example.employee_management.dto.ProfileUpdateRequestDto;
import com.example.employee_management.dto.UpdateUserRequestDto;
import com.example.employee_management.dto.UserRequestDto;
import com.example.employee_management.dto.UserResponseDto;
import com.example.employee_management.entity.User;
import com.example.employee_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    // =========================
    // CREATE USER
    // =========================

    public UserResponseDto createUser(UserRequestDto request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Encrypt password before saving
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        return convertToResponseDto(savedUser);
    }


    // =========================
    // GET ALL USERS
    // =========================

    public List<UserResponseDto> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToResponseDto)
                .toList();
    }


    // =========================
    // GET USER BY ID
    // =========================

    public UserResponseDto getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id " + id
                        )
                );

        return convertToResponseDto(user);
    }


    // =========================
    // GET USER BY EMAIL
    // =========================

    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email " + email
                        )
                );
    }


    // =========================
    // UPDATE USER
    // ADMIN ONLY
    // =========================

    public UserResponseDto updateUser(
            Long id,
            UpdateUserRequestDto updatedUser
    ) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id " + id
                        )
                );

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRole(updatedUser.getRole());


        // Change password only if a new password was provided
        if (updatedUser.getPassword() != null &&
                !updatedUser.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            updatedUser.getPassword()
                    )
            );
        }


        User savedUser =
                userRepository.save(existingUser);

        return convertToResponseDto(savedUser);
    }


    // =========================
    // DELETE USER
    // ADMIN ONLY
    // =========================

    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException(
                    "User not found with id " + id
            );
        }

        userRepository.deleteById(id);
    }


    // =========================
    // UPDATE MY PROFILE
    // EMPLOYEE SELF-SERVICE
    // =========================

    public UserResponseDto updateMyProfile(
            String email,
            ProfileUpdateRequestDto request
    ) {

        // Find currently logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email " + email
                        )
                );


        // =========================
        // CHECK EMAIL DUPLICATION
        // =========================

        if (!user.getEmail()
                .equalsIgnoreCase(request.getEmail())) {

            userRepository.findByEmail(request.getEmail())
                    .ifPresent(existingUser -> {
                        throw new RuntimeException(
                                "Email address is already in use"
                        );
                    });
        }


        // =========================
        // UPDATE PROFILE
        // =========================

        user.setName(request.getName());
        user.setEmail(request.getEmail());


        // =========================
        // SAVE PROFILE
        // =========================

        User savedUser =
                userRepository.save(user);

        return convertToResponseDto(savedUser);
    }


    // =========================
    // UPLOAD MY PROFILE PHOTO
    // EMPLOYEE SELF-SERVICE
    // =========================

    public ProfileResponseDto uploadMyProfilePhoto(
            String email,
            MultipartFile file
    ) throws IOException {

        // =========================
        // FIND LOGGED-IN USER
        // =========================

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email " + email
                        )
                );


        // =========================
        // VALIDATE FILE
        // =========================

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Please select an image."
            );
        }


        // Maximum size = 5 MB
        if (file.getSize() > 5 * 1024 * 1024) {

            throw new RuntimeException(
                    "Image size must be less than 5 MB."
            );
        }


        // =========================
        // VALIDATE IMAGE TYPE
        // =========================

        String contentType =
                file.getContentType();

        if (contentType == null ||
                !contentType.equals("image/jpeg") &&
                        !contentType.equals("image/png") &&
                        !contentType.equals("image/webp")) {

            throw new RuntimeException(
                    "Only JPG, PNG and WEBP images are allowed."
            );
        }


        // =========================
        // CREATE UPLOAD DIRECTORY
        // =========================

        Path uploadPath = Paths.get(
                "uploads",
                "profile-photos"
        );

        Files.createDirectories(uploadPath);


        // =========================
        // CREATE FILE EXTENSION
        // =========================

        String extension;

        if (contentType.equals("image/png")) {

            extension = ".png";

        } else if (contentType.equals("image/webp")) {

            extension = ".webp";

        } else {

            extension = ".jpg";
        }


        // =========================
        // CREATE UNIQUE FILE NAME
        // =========================

        String filename =
                UUID.randomUUID() + extension;

        Path filePath =
                uploadPath.resolve(filename);


        // =========================
        // DELETE OLD PROFILE PHOTO
        // =========================

        if (user.getProfilePhotoUrl() != null &&
                !user.getProfilePhotoUrl().isBlank()) {

            String oldFilename =
                    Paths.get(user.getProfilePhotoUrl())
                            .getFileName()
                            .toString();

            Path oldFile =
                    uploadPath.resolve(oldFilename);

            Files.deleteIfExists(oldFile);
        }


        // =========================
        // SAVE NEW PHOTO
        // =========================

        Files.copy(
                file.getInputStream(),
                filePath
        );


        // =========================
        // SAVE PHOTO URL
        // =========================

        String photoUrl =
                "/uploads/profile-photos/" + filename;

        user.setProfilePhotoUrl(photoUrl);


        // =========================
        // SAVE USER
        // =========================

        User savedUser =
                userRepository.save(user);


        // =========================
        // RETURN PROFILE
        // =========================

        return convertToProfileResponseDto(
                savedUser
        );
    }


    // =========================
    // CONVERT USER TO DTO
    // =========================

    private UserResponseDto convertToResponseDto(
            User user
    ) {

        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }


    // =========================
    // CONVERT USER TO PROFILE DTO
    // =========================

    private ProfileResponseDto convertToProfileResponseDto(
            User user
    ) {

        return new ProfileResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getProfilePhotoUrl()
        );
    }
}