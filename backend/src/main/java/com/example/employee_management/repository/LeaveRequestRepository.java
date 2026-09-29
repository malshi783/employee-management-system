package com.example.employee_management.repository;

import com.example.employee_management.entity.LeaveRequest;

import com.example.employee_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUserOrderByCreatedAtDesc(User user);

    List<LeaveRequest> findAllByOrderByCreatedAtDesc();
}
