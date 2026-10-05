package com.example.employee_management.dto;

import com.example.employee_management.entity.SupportStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupportResponseDto {

    private Long id;
    private Long userId;
    private String employeeName;
    private String employeeEmail;
    private String subject;
    private String description;
    private SupportStatus status;
    private LocalDateTime createdAt;
}