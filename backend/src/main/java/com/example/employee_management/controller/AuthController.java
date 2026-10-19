package com.example.employee_management.controller;

import com.example.employee_management.config.JwtService;
import com.example.employee_management.dto.InitialAdminRequestDto;
import com.example.employee_management.dto.LoginRequestDto;
import com.example.employee_management.dto.LoginResponseDto;
import com.example.employee_management.entity.User;
import com.example.employee_management.repository.UserRepository;
import com.example.employee_management.service.InitialAdminRegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Pattern BCRYPT_HASH_PATTERN =
            Pattern.compile("^\\$2[aby]\\$\\d{2}\\$[./A-Za-z0-9]{53}$");
    private static final Set<String> SUPPORTED_ROLES = Set.of("ADMIN", "EMPLOYEE");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final InitialAdminRegistrationService initialAdminRegistrationService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            InitialAdminRegistrationService initialAdminRegistrationService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.initialAdminRegistrationService = initialAdminRegistrationService;
    }

    @GetMapping("/setup-status")
    public ResponseEntity<Map<String, Boolean>> setupStatus() {
        return ResponseEntity.ok(Map.of(
                "setupRequired",
                userRepository.count() == 0
        ));
    }

    @PostMapping("/register-first-admin")
    public ResponseEntity<LoginResponseDto> registerFirstAdmin(
            @Valid @RequestBody InitialAdminRequestDto request
    ) {
        User admin = initialAdminRegistrationService.register(request);
        String token = jwtService.generateToken(admin.getEmail(), admin.getRole());

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new LoginResponseDto(token, admin.getEmail(), admin.getRole())
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto request) {

        User user = userRepository.findByEmailIgnoreCase(request.getEmail().trim())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        String storedPassword = user.getPassword();
        boolean passwordNeedsUpgrade =
                !BCRYPT_HASH_PATTERN.matcher(storedPassword).matches();
        boolean passwordMatches;

        if (!passwordNeedsUpgrade) {
            passwordMatches = passwordEncoder.matches(
                    request.getPassword(),
                    storedPassword
            );
        } else {
            passwordMatches = storedPassword.equals(request.getPassword());
            if (passwordMatches) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
        }

        if (!passwordMatches) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        String normalizedRole = user.getRole() == null
                ? ""
                : user.getRole().trim().toUpperCase(Locale.ROOT);
        if (!SUPPORTED_ROLES.contains(normalizedRole)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        boolean roleNeedsNormalization = !normalizedRole.equals(user.getRole());
        if (roleNeedsNormalization) {
            user.setRole(normalizedRole);
        }
        if (passwordNeedsUpgrade || roleNeedsNormalization) {
            userRepository.save(user);
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                normalizedRole
        );

        LoginResponseDto response = new LoginResponseDto(
                token,
                user.getEmail(),
                normalizedRole
        );

        return ResponseEntity.ok(response);
    }
}