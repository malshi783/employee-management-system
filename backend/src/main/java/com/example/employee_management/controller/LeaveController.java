package com.example.employee_management.controller;

import com.example.employee_management.dto.LeaveRequestDto;
import com.example.employee_management.dto.LeaveResponseDto;
import com.example.employee_management.entity.LeaveRequest;
import com.example.employee_management.entity.LeaveStatus;
import com.example.employee_management.entity.User;
import com.example.employee_management.service.LeaveService;
import com.example.employee_management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;
    private final UserService userService;

    // Employee creates a leave request
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<LeaveResponseDto> createLeaveRequest(
            @Valid @RequestBody LeaveRequestDto dto,
            Authentication authentication) {

        User user = userService.getUserByEmail(authentication.getName());

        LeaveRequest leaveRequest =
                leaveService.createLeaveRequest(user, dto);

        return ResponseEntity.ok(convertToResponseDto(leaveRequest));
    }

    // Employee views their own leave requests
    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<LeaveResponseDto>> getMyLeaveRequests(
            Authentication authentication) {

        User user = userService.getUserByEmail(authentication.getName());

        List<LeaveResponseDto> response = leaveService
                .getEmployeeLeaveRequests(user)
                .stream()
                .map(this::convertToResponseDto)
                .toList();

        return ResponseEntity.ok(response);
    }

    // Admin views all leave requests
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveResponseDto>> getAllLeaveRequests() {

        List<LeaveResponseDto> response = leaveService
                .getAllLeaveRequests()
                .stream()
                .map(this::convertToResponseDto)
                .toList();

        return ResponseEntity.ok(response);
    }

    // Admin approves/rejects a leave request
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveResponseDto> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam LeaveStatus status) {

        LeaveRequest leaveRequest =
                leaveService.updateLeaveStatus(id, status);

        return ResponseEntity.ok(convertToResponseDto(leaveRequest));
    }

    private LeaveResponseDto convertToResponseDto(LeaveRequest leaveRequest) {

        return new LeaveResponseDto(
                leaveRequest.getId(),
                leaveRequest.getUser().getId(),
                leaveRequest.getUser().getName(),
                leaveRequest.getUser().getEmail(),
                leaveRequest.getLeaveType(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getReason(),
                leaveRequest.getStatus(),
                leaveRequest.getCreatedAt()
        );
    }
}