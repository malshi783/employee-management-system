package com.example.employee_management.service;

import com.example.employee_management.dto.SupportRequestDto;
import com.example.employee_management.entity.SupportRequest;
import com.example.employee_management.entity.SupportStatus;
import com.example.employee_management.entity.User;
import com.example.employee_management.repository.SupportRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportRequestRepository supportRequestRepository;

    public SupportRequest createSupportRequest(
            User user,
            SupportRequestDto dto) {

        SupportRequest request = new SupportRequest();

        request.setUser(user);
        request.setSubject(dto.getSubject());
        request.setDescription(dto.getDescription());
        request.setStatus(SupportStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());

        return supportRequestRepository.save(request);
    }

    public List<SupportRequest> getEmployeeSupportRequests(User user) {
        return supportRequestRepository
                .findByUserOrderByCreatedAtDesc(user);
    }

    public List<SupportRequest> getAllSupportRequests() {
        return supportRequestRepository
                .findAllByOrderByCreatedAtDesc();
    }

    public SupportRequest getSupportRequestById(Long id) {
        return supportRequestRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Support request not found"));
    }

    public SupportRequest resolveSupportRequest(Long id) {

        SupportRequest request =
                getSupportRequestById(id);

        request.setStatus(SupportStatus.RESOLVED);

        return supportRequestRepository.save(request);
    }
}