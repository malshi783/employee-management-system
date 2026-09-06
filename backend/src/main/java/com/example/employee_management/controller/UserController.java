package com.example.employee_management.controller;
import org.springframework.security.access.prepost.PreAuthorize;
import com.example.employee_management.dto.UpdateUserRequestDto;
import com.example.employee_management.dto.UserRequestDto;
import com.example.employee_management.dto.UserResponseDto;

import com.example.employee_management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    //CREATE USER
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto>createUser(
            @Valid @RequestBody UserRequestDto request
    ) {

        return ResponseEntity.ok(userService.createUser(request));


    }
    //Get All Users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto>>getAllUsers()

    {
        return ResponseEntity.ok(userService.getAllUsers() );
    }


    //GET USER BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> getUserById(
            @PathVariable Long id


    ) {
        return ResponseEntity.ok(userService.getUserById(id));


    }

    //UPDATE USER
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequestDto request

    ) {

        return ResponseEntity.ok(userService.updateUser(id, request));

    }
    //DELETE USER
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser
    (@PathVariable Long id) {

        userService.deleteUser(id);
        return  ResponseEntity.ok("User deleted successfully");
    }
}
