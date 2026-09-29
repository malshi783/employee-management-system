package com.example.employee_management.service;

import com.example.employee_management.entity.Attendance;
import com.example.employee_management.entity.AttendanceStatus;
import com.example.employee_management.entity.User;
import com.example.employee_management.repository.AttendanceRepository;
import com.example.employee_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;


    // =========================
    // MARK ATTENDANCE
    // =========================

    public Attendance markAttendance(
            Long userId,
            LocalDate date,
            AttendanceStatus status
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with id " + userId
                        )
                );

        // Check whether attendance already exists
        Attendance attendance =
                attendanceRepository
                        .findByUserAndDate(user, date)
                        .orElse(null);

        if (attendance == null) {

            attendance = new Attendance();

            attendance.setUser(user);
            attendance.setDate(date);
        }

        attendance.setStatus(status);

        return attendanceRepository.save(attendance);
    }


    // =========================
    // GET EMPLOYEE ATTENDANCE
    // =========================

    public List<Attendance> getEmployeeAttendance(
            Long userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with id " + userId
                        )
                );

        return attendanceRepository
                .findByUserOrderByDateDesc(user);
    }


    // =========================
    // GET ATTENDANCE FOR DATE
    // =========================

    public Attendance getAttendanceByDate(
            Long userId,
            LocalDate date
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with id " + userId
                        )
                );

        return attendanceRepository
                .findByUserAndDate(user, date)
                .orElse(null);
    }


    // =========================
    // ATTENDANCE STATISTICS
    // =========================

    public long getPresentCount(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with id " + userId
                        )
                );

        return attendanceRepository.countByUserAndStatus(
                user,
                AttendanceStatus.PRESENT
        );
    }


    public long getAbsentCount(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with id " + userId
                        )
                );

        return attendanceRepository.countByUserAndStatus(
                user,
                AttendanceStatus.ABSENT
        );
    }


    public long getLateCount(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with id " + userId
                        )
                );

        return attendanceRepository.countByUserAndStatus(
                user,
                AttendanceStatus.LATE
        );
    }


    // =========================
    // ATTENDANCE PERCENTAGE
    // =========================

    public double getAttendancePercentage(Long userId) {

        long present = getPresentCount(userId);

        long absent = getAbsentCount(userId);

        long late = getLateCount(userId);

        long total = present + absent + late;

        if (total == 0) {
            return 0.0;
        }

        // PRESENT and LATE are considered attended
        return ((double) (present + late) / total) * 100;
    }


    // =====================================================
    // EMPLOYEE SELF-SERVICE
    // =====================================================

    // Get attendance of the currently logged-in employee
    public List<Attendance> getMyAttendance(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email " + email
                        )
                );

        return attendanceRepository
                .findByUserOrderByDateDesc(user);
    }


    // Get attendance percentage of the currently logged-in employee
    public double getMyAttendancePercentage(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email " + email
                        )
                );

        long present =
                attendanceRepository.countByUserAndStatus(
                        user,
                        AttendanceStatus.PRESENT
                );

        long absent =
                attendanceRepository.countByUserAndStatus(
                        user,
                        AttendanceStatus.ABSENT
                );

        long late =
                attendanceRepository.countByUserAndStatus(
                        user,
                        AttendanceStatus.LATE
                );

        long total = present + absent + late;

        if (total == 0) {
            return 0.0;
        }

        // PRESENT and LATE are considered attended
        return ((double) (present + late) / total) * 100;
    }
}