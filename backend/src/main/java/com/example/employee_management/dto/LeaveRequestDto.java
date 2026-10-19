package com.example.employee_management.dto;

import com.example.employee_management.entity.LeaveType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
@Getter
@Setter
public class LeaveRequestDto {

    @NotNull(message = "Leave type is Required")
    private LeaveType leaveType;
    @NotNull(message = "StartDate is Required")
    private LocalDate startDate;

    @NotNull(message = "EndDate is Required")
    private LocalDate endDate;

    @NotNull(message = "Reason is Required")
    @Size(max = 500,message = "Reason cannot exceed 500 characters")
    private String reason;
}
