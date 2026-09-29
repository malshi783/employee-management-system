package com.example.employee_management.controller;

import com.example.employee_management.dto.ProfileResponseDto;
import com.example.employee_management.dto.ProfileUpdateRequestDto;
import com.example.employee_management.dto.UserResponseDto;
import com.example.employee_management.entity.User;
import com.example.employee_management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;


    // =========================
    // GET MY PROFILE
    // =========================

    @GetMapping("/me")
    public ResponseEntity<ProfileResponseDto> getMyProfile(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email);

        ProfileResponseDto response = new ProfileResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getProfilePhotoUrl()
        );

        return ResponseEntity.ok(response);
    }


    // =========================
    // UPDATE MY PROFILE
    // =========================

    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequestDto request
    ) {

        String email = authentication.getName();

        UserResponseDto updatedProfile =
                userService.updateMyProfile(
                        email,
                        request
                );

        return ResponseEntity.ok(updatedProfile);
    }


    // =========================
    // UPLOAD MY PROFILE PHOTO
    // =========================

    @PostMapping("/me/photo")
    public ResponseEntity<ProfileResponseDto> uploadProfilePhoto(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        String email = authentication.getName();

        ProfileResponseDto response =
                userService.uploadMyProfilePhoto(
                        email,
                        file
                );

        return ResponseEntity.ok(response);
    }
}