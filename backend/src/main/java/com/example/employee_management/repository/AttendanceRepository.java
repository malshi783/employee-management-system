package com.example.employee_management.repository;

import com.example.employee_management.entity.Attendance;
import com.example.employee_management.entity.AttendanceStatus;
import com.example.employee_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByUser(User user);

    List<Attendance> findByUserOrderByDateDesc(User user);

    List<Attendance> findByDate(LocalDate date);

    Optional<Attendance> findByUserAndDate(
            User user,
            LocalDate date
    );

    long countByUserAndStatus(
            User user,
            AttendanceStatus status
    );
}