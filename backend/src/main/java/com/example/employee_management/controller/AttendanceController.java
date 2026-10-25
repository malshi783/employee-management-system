package com.example.employee_management.controller;

import com.example.employee_management.dto.AttendanceRequestDto;
import com.example.employee_management.dto.AttendanceResponseDto;
import com.example.employee_management.entity.Attendance;
import com.example.employee_management.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;


    // ==========================================
    // ADMIN - MARK / UPDATE ATTENDANCE
    // ==========================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceResponseDto>> getAttendanceForDate(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        List<AttendanceResponseDto> response =
                attendanceService.getAttendanceByDate(date)
                        .stream()
                        .map(this::convertToResponseDto)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AttendanceResponseDto> markAttendance(
            @Valid @RequestBody AttendanceRequestDto request
    ) {

        Attendance attendance =
                attendanceService.markAttendance(
                        request.getUserId(),
                        request.getDate(),
                        request.getStatus()
                );

        return ResponseEntity.ok(
                convertToResponseDto(attendance)
        );
    }


    // ==========================================
    // ADMIN - VIEW EMPLOYEE ATTENDANCE
    // ==========================================

    @GetMapping("/employee/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceResponseDto>>
    getEmployeeAttendance(
            @PathVariable Long userId
    ) {

        List<AttendanceResponseDto> response =
                attendanceService
                        .getEmployeeAttendance(userId)
                        .stream()
                        .map(this::convertToResponseDto)
                        .toList();

        return ResponseEntity.ok(response);
    }


    // ==========================================
    // EMPLOYEE - VIEW MY ATTENDANCE
    // ==========================================

    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<AttendanceResponseDto>>
    getMyAttendance(
            Authentication authentication
    ) {

        String email = authentication.getName();

        List<AttendanceResponseDto> response =
                attendanceService
                        .getMyAttendance(email)
                        .stream()
                        .map(this::convertToResponseDto)
                        .toList();

        return ResponseEntity.ok(response);
    }


    // ==========================================
    // EMPLOYEE - MY ATTENDANCE STATISTICS
    // ==========================================

    @GetMapping("/me/stats")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Map<String, Object>>
    getMyAttendanceStats(
            Authentication authentication
    ) {

        String email = authentication.getName();

        double percentage =
                attendanceService
                        .getMyAttendancePercentage(email);

        // Get attendance records to calculate counts
        List<Attendance> attendanceList =
                attendanceService.getMyAttendance(email);

        long present = attendanceList.stream()
                .filter(attendance ->
                        attendance.getStatus().name().equals("PRESENT"))
                .count();

        long absent = attendanceList.stream()
                .filter(attendance ->
                        attendance.getStatus().name().equals("ABSENT"))
                .count();

        long late = attendanceList.stream()
                .filter(attendance ->
                        attendance.getStatus().name().equals("LATE"))
                .count();

        Map<String, Object> stats =
                new LinkedHashMap<>();

        stats.put("present", present);
        stats.put("absent", absent);
        stats.put("late", late);
        stats.put("percentage", percentage);

        return ResponseEntity.ok(stats);
    }


    // ==========================================
    // CONVERT ENTITY → DTO
    // ==========================================

    private AttendanceResponseDto convertToResponseDto(
            Attendance attendance
    ) {

        return new AttendanceResponseDto(
                attendance.getId(),
                attendance.getUser().getId(),
                attendance.getUser().getName(),
                attendance.getDate(),
                attendance.getStatus()
        );
    }
}