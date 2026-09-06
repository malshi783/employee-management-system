package com.example.employee_management.service;

import com.example.employee_management.dto.UpdateUserRequestDto;
import com.example.employee_management.dto.UserRequestDto;
import com.example.employee_management.dto.UserResponseDto;
import com.example.employee_management.entity.User;
import com.example.employee_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    // CREATE USER
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


    // GET ALL USERS
    public List<UserResponseDto> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToResponseDto)
                .toList();
    }


    // GET USER BY ID
    public UserResponseDto getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id " + id
                        )
                );

        return convertToResponseDto(user);
    }


    // GET USER BY EMAIL
    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email " + email
                        )
                );
    }


    // UPDATE USER
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


        // Save updated user
        User savedUser = userRepository.save(existingUser);

        return convertToResponseDto(savedUser);
    }


    // DELETE USER
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException(
                    "User not found with id " + id
            );
        }

        userRepository.deleteById(id);
    }


    // CONVERT User entity to UserResponseDto
    private UserResponseDto convertToResponseDto(User user) {

        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}