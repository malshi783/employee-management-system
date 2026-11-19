package com.example.employee_management.controller;

import com.example.employee_management.dto.InitialAdminRequestDto;
import com.example.employee_management.repository.UserRepository;
import com.example.employee_management.service.InitialAdminRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/initial-admin")
@RequiredArgsConstructor
public class InitialAdminController {

    private final UserRepository userRepository;
    private final InitialAdminRegistrationService registrationService;

    @GetMapping("/status")
    public Map<String, Boolean> status() {
        return Map.of("setupRequired", userRepository.count() == 0);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> register(
            @Valid @RequestBody InitialAdminRequestDto request
    ) {
        var admin = registrationService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "email", admin.getEmail(),
                "role", admin.getRole()
        ));
    }
}
