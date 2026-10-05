package com.example.employee_management.controller;

import com.example.employee_management.dto.SupportRequestDto;
import com.example.employee_management.dto.SupportResponseDto;
import com.example.employee_management.entity.SupportRequest;
import com.example.employee_management.entity.User;
import com.example.employee_management.service.SupportService;
import com.example.employee_management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SupportResponseDto> createSupportRequest(
            @Valid @RequestBody SupportRequestDto dto,
            Authentication authentication) {

        User user = userService.getUserByEmail(authentication.getName());

        SupportRequest request =
                supportService.createSupportRequest(user, dto);

        return ResponseEntity.ok(convertToResponseDto(request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<SupportResponseDto>> getMySupportRequests(
            Authentication authentication) {

        User user = userService.getUserByEmail(authentication.getName());

        List<SupportResponseDto> response = supportService
                .getEmployeeSupportRequests(user)
                .stream()
                .map(this::convertToResponseDto)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SupportResponseDto>> getAllSupportRequests() {

        List<SupportResponseDto> response = supportService
                .getAllSupportRequests()
                .stream()
                .map(this::convertToResponseDto)
                .toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SupportResponseDto> resolveSupportRequest(
            @PathVariable Long id) {

        SupportRequest request =
                supportService.resolveSupportRequest(id);

        return ResponseEntity.ok(convertToResponseDto(request));
    }

    private SupportResponseDto convertToResponseDto(
            SupportRequest request) {

        return new SupportResponseDto(
                request.getId(),
                request.getUser().getId(),
                request.getUser().getName(),
                request.getUser().getEmail(),
                request.getSubject(),
                request.getDescription(),
                request.getStatus(),
                request.getCreatedAt()
        );
    }
}