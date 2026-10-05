package com.example.employee_management.repository;

import com.example.employee_management.entity.SupportRequest;
import com.example.employee_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportRequestRepository
        extends JpaRepository<SupportRequest, Long> {

    List<SupportRequest> findByUserOrderByCreatedAtDesc(User user);

    List<SupportRequest> findAllByOrderByCreatedAtDesc();
}