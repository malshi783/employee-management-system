package com.example.employee_management;

import com.example.employee_management.config.DevelopmentAdminBootstrap;
import com.example.employee_management.entity.User;
import com.example.employee_management.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:employee-management-bootstrap-test;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.show-sql=false",
        "jwt.secret=test-only-bootstrap-key-not-for-production-123456",
        "jwt.expiration=86400000",
        "app.bootstrap-admin.enabled=true",
        "app.bootstrap-admin.name=Bootstrap Administrator",
        "app.bootstrap-admin.email=bootstrap-admin@example.test",
        "app.bootstrap-admin.password=bootstrap-test-password-9283!"
})
@ActiveProfiles("local")
class DevelopmentAdminBootstrapTests {

    private static final String ADMIN_EMAIL = "bootstrap-admin@example.test";
    private static final String ADMIN_PASSWORD = "bootstrap-test-password-9283!";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DevelopmentAdminBootstrap adminBootstrap;

    @Test
    void createsHashedAdminOnceAndDoesNotOverwriteExistingPassword() throws Exception {
        User admin = userRepository.findByEmailIgnoreCase(ADMIN_EMAIL)
                .orElseThrow();

        assertEquals("ADMIN", admin.getRole());
        assertNotEquals(ADMIN_PASSWORD, admin.getPassword());
        assertTrue(passwordEncoder.matches(ADMIN_PASSWORD, admin.getPassword()));

        String originalPasswordHash = admin.getPassword();
        adminBootstrap.run(null);

        User unchangedAdmin = userRepository.findByEmailIgnoreCase(ADMIN_EMAIL)
                .orElseThrow();
        assertEquals(originalPasswordHash, unchangedAdmin.getPassword());
        assertEquals(1, userRepository.count());
    }
}
