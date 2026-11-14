package com.example.employee_management.dto;

import com.example.employee_management.entity.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequestDto {

    private Long userId;

    private LocalDate date;

    private AttendanceStatus status;
}