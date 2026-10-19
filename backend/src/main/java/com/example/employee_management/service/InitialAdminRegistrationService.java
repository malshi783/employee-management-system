package com.example.employee_management.service;

import com.example.employee_management.dto.InitialAdminRequestDto;
import com.example.employee_management.entity.User;
import com.example.employee_management.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class InitialAdminRegistrationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public InitialAdminRegistrationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public User register(InitialAdminRequestDto request) {
        if (userRepository.count() != 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Initial administrator setup has already been completed."
            );
        }

        String email = request.email().trim();
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account with that email already exists."
            );
        }

        User admin = new User();
        admin.setName(request.name().trim());
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(request.password()));
        admin.setRole("ADMIN");
        return userRepository.saveAndFlush(admin);
    }
}
