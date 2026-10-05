package com.example.employee_management.service;

import com.example.employee_management.dto.LeaveRequestDto;
import com.example.employee_management.entity.LeaveRequest;
import com.example.employee_management.entity.LeaveStatus;
import com.example.employee_management.entity.User;
import com.example.employee_management.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequest createLeaveRequest(User user , LeaveRequestDto dto){

        LeaveRequest  leaveRequest = new LeaveRequest();

        leaveRequest.setUser(user);
        leaveRequest.setLeaveType(dto.getLeaveType());
        leaveRequest.setStartDate(dto.getStartDate());
        leaveRequest.setEndDate(dto.getEndDate());
        leaveRequest.setReason(dto.getReason());

        leaveRequest.setStatus(LeaveStatus.PENDING);
        leaveRequest.setCreatedAt(LocalDateTime.now());
        return leaveRequestRepository.save(leaveRequest);
    }
    public List<LeaveRequest> getEmployeeLeaveRequests(User user){
        return leaveRequestRepository
                .findByUserOrderByCreatedAtDesc(user);

    }
    public List<LeaveRequest> getAllLeaveRequests(){
        return leaveRequestRepository
                .findAllByOrderByCreatedAtDesc();

    }
    public LeaveRequest getLeaveRequestById(Long id){
        return leaveRequestRepository
                .findById(id).orElseThrow(() ->
                        new RuntimeException("Leave Request Not found"));
    }
 public LeaveRequest updateLeaveStatus(Long id, LeaveStatus status){
        LeaveRequest leaveRequest = getLeaveRequestById(id);
        leaveRequest.setStatus(status);
        return leaveRequestRepository.save(leaveRequest);
 }
}

