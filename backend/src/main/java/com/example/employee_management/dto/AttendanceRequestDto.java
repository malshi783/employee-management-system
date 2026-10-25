package com.example.employee_management.dto;

import com.example.employee_management.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
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

    @NotNull
    @Positive
    private Long userId;

    @NotNull
    @PastOrPresent
    private LocalDate date;

    @NotNull
    private AttendanceStatus status;
}