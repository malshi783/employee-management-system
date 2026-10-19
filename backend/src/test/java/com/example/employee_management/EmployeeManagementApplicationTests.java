package com.example.employee_management;

import com.example.employee_management.entity.User;
import com.example.employee_management.repository.AttendanceRepository;
import com.example.employee_management.repository.LeaveRequestRepository;
import com.example.employee_management.repository.SupportRequestRepository;
import com.example.employee_management.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.mock.web.MockMultipartFile;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:employee-management-test;MODE=MySQL;DB_CLOSE_DELAY=-1",
		"spring.datasource.username=sa",
		"spring.datasource.password=",
		"spring.jpa.hibernate.ddl-auto=create-drop",
		"spring.jpa.show-sql=false",
		"jwt.secret=test-only-context-load-key-not-for-production-123456",
		"jwt.expiration=86400000"
})
@AutoConfigureMockMvc
class EmployeeManagementApplicationTests {

	private static final String ADMIN_EMAIL = "admin@example.test";
	private static final String EMPLOYEE_EMAIL = "employee@example.test";
	private static final String TEST_PASSWORD = "test-password";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private AttendanceRepository attendanceRepository;

	@Autowired
	private LeaveRequestRepository leaveRequestRepository;

	@Autowired
	private SupportRequestRepository supportRequestRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@BeforeEach
	void seedUsers() {
		attendanceRepository.deleteAll();
		leaveRequestRepository.deleteAll();
		supportRequestRepository.deleteAll();
		userRepository.deleteAll();
		userRepository.save(createUser("Test Admin", ADMIN_EMAIL, "ADMIN"));
		userRepository.save(createUser("Test Employee", EMPLOYEE_EMAIL, "EMPLOYEE"));
	}

	@Test
	void contextLoads() {
	}

	@Test
	void successfulLoginReturnsJwtAndAuthenticatesProfileRequest() throws Exception {
		MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginJson(EMPLOYEE_EMAIL, TEST_PASSWORD)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value(EMPLOYEE_EMAIL))
				.andExpect(jsonPath("$.role").value("EMPLOYEE"))
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andReturn();

		String token = objectMapper.readTree(
				loginResult.getResponse().getContentAsString()
		).get("token").asText();

		mockMvc.perform(get("/api/profile/me")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value(EMPLOYEE_EMAIL))
				.andExpect(jsonPath("$.role").value("EMPLOYEE"));
	}

	@Test
	void invalidCredentialsAreRejected() throws Exception {
		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginJson(EMPLOYEE_EMAIL, "wrong-password")))
				.andExpect(status().isUnauthorized());

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginJson("unknown@example.test", TEST_PASSWORD)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void legacyPlaintextAdminPasswordIsUpgradedOnSuccessfulLogin() throws Exception {
		User legacyAdmin = new User();
		legacyAdmin.setName("Legacy Admin");
		legacyAdmin.setEmail("legacy-admin@example.test");
		legacyAdmin.setPassword("legacy-password");
		legacyAdmin.setRole("admin");
		userRepository.saveAndFlush(legacyAdmin);

		MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginJson("legacy-admin@example.test", "legacy-password")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.role").value("ADMIN"))
				.andReturn();

		String token = objectMapper.readTree(
				loginResult.getResponse().getContentAsString()
		).get("token").asText();

		User upgradedAdmin = userRepository.findByEmailIgnoreCase(
				"legacy-admin@example.test"
		).orElseThrow();
		assertNotEquals("legacy-password", upgradedAdmin.getPassword());
		assertTrue(passwordEncoder.matches("legacy-password", upgradedAdmin.getPassword()));
		assertEquals("ADMIN", upgradedAdmin.getRole());

		mockMvc.perform(get("/api/users")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());
	}

	@Test
	void loginIsRejectedWhenUsersTableIsEmpty() throws Exception {
		userRepository.deleteAll();

		mockMvc.perform(get("/api/auth/setup-status"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.setupRequired").value(true));

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginJson(EMPLOYEE_EMAIL, TEST_PASSWORD)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void firstAdminCanSignUpOnlyOnceAndIsLoggedIn() throws Exception {
		userRepository.deleteAll();

		MvcResult signupResult = mockMvc.perform(post("/api/auth/register-first-admin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"name":"First Administrator","email":"first-admin@example.test","password":"a-long-test-password-123"}
								"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.email").value("first-admin@example.test"))
				.andExpect(jsonPath("$.role").value("ADMIN"))
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andReturn();

		String token = objectMapper.readTree(
				signupResult.getResponse().getContentAsString()
		).get("token").asText();

		assertTrue(passwordEncoder.matches(
				"a-long-test-password-123",
				userRepository.findByEmailIgnoreCase("first-admin@example.test")
						.orElseThrow()
						.getPassword()
		));

		mockMvc.perform(get("/api/profile/me")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.role").value("ADMIN"));

		mockMvc.perform(post("/api/users")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"name":"Second Administrator","email":"second-admin@example.test","password":"another-test-password-123","role":"ADMIN"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.role").value("ADMIN"));

		mockMvc.perform(get("/api/auth/setup-status"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.setupRequired").value(false));

		mockMvc.perform(post("/api/auth/register-first-admin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"name":"Second Administrator","email":"second-admin@example.test","password":"another-long-test-password-123"}
								"""))
				.andExpect(status().isConflict());
	}

	@Test
	void firstAdminSignupValidatesInput() throws Exception {
		userRepository.deleteAll();

		mockMvc.perform(post("/api/auth/register-first-admin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"name":"","email":"not-an-email","password":"short"}
								"""))
				.andExpect(status().isBadRequest());

		assertEquals(0, userRepository.count());
	}

	@Test
	void loginRejectsMissingOrInvalidFields() throws Exception {
		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"email":"","password":""}
								"""))
				.andExpect(status().isBadRequest());

		MvcResult invalidEmailResult = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"email":"not-an-email","password":"do-not-echo-this-password"}
								"""))
				.andExpect(status().isBadRequest())
				.andReturn();

		assertFalse(invalidEmailResult.getResponse().getContentAsString()
				.contains("do-not-echo-this-password"));
	}

	@Test
	void protectedProfileRejectsMissingAndInvalidJwt() throws Exception {
		mockMvc.perform(get("/api/profile/me"))
				.andExpect(status().isForbidden());

		mockMvc.perform(get("/api/profile/me")
						.header("Authorization", "Bearer invalid-token"))
				.andExpect(status().isForbidden());
	}

	@Test
	void adminAndEmployeeRolesAreEnforcedByProtectedEndpoints() throws Exception {
		String adminToken = authenticate(ADMIN_EMAIL);
		String employeeToken = authenticate(EMPLOYEE_EMAIL);

		mockMvc.perform(get("/api/users")
						.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/users")
						.header("Authorization", "Bearer " + employeeToken))
				.andExpect(status().isForbidden());

		mockMvc.perform(get("/api/attendance/me")
						.header("Authorization", "Bearer " + employeeToken))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/attendance/me")
						.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isForbidden());
	}

	@Test
	void unauthenticatedApiRequestsAreRejected() throws Exception {
		mockMvc.perform(get("/api/leaves"))
				.andExpect(status().isForbidden());
	}

	@Test
	void invalidUserAndProfileInputReturnsBadRequest() throws Exception {
		String adminToken = authenticate(ADMIN_EMAIL);
		String employeeToken = authenticate(EMPLOYEE_EMAIL);

		mockMvc.perform(post("/api/users")
						.header("Authorization", "Bearer " + adminToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"name":"","email":"not-an-email","password":"x","role":""}
								"""))
				.andExpect(status().isBadRequest());

		mockMvc.perform(put("/api/profile/me")
						.header("Authorization", "Bearer " + employeeToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"name":"","email":"not-an-email"}
								"""))
				.andExpect(status().isBadRequest());
	}

	@Test
	void adminCanCreateReadUpdateAndDeleteEmployee() throws Exception {
		String adminToken = authenticate(ADMIN_EMAIL);
		String employeeToken = authenticate(EMPLOYEE_EMAIL);

		MvcResult createResult = mockMvc.perform(post("/api/users")
						.header("Authorization", "Bearer " + adminToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"name":"Integration Employee","email":"integration-employee@example.test","password":"test-password","role":"EMPLOYEE"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value("integration-employee@example.test"))
				.andReturn();

		JsonNode created = objectMapper.readTree(
				createResult.getResponse().getContentAsString()
		);
		String employeeId = created.get("id").asText();

		mockMvc.perform(get("/api/users/" + employeeId)
						.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Integration Employee"));

		mockMvc.perform(put("/api/users/" + employeeId)
						.header("Authorization", "Bearer " + adminToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"name":"Updated Integration Employee","email":"integration-employee@example.test","role":"EMPLOYEE"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Updated Integration Employee"));

		mockMvc.perform(get("/api/users/" + employeeId)
						.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Updated Integration Employee"));

		mockMvc.perform(delete("/api/users/" + employeeId)
						.header("Authorization", "Bearer " + employeeToken))
				.andExpect(status().isForbidden());

		mockMvc.perform(delete("/api/users/" + employeeId)
						.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk());

		org.junit.jupiter.api.Assertions.assertTrue(
				userRepository.findByEmail("integration-employee@example.test").isEmpty()
		);
	}

	@Test
	void employeeCanUpdateAndReadBackOwnProfile() throws Exception {
		String employeeToken = authenticate(EMPLOYEE_EMAIL);

		mockMvc.perform(put("/api/profile/me")
						.header("Authorization", "Bearer " + employeeToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"name":"Updated Test Employee","email":"updated-employee@example.test"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Updated Test Employee"))
				.andExpect(jsonPath("$.email").value("updated-employee@example.test"));

		String updatedToken = authenticate("updated-employee@example.test");
		mockMvc.perform(get("/api/profile/me")
						.header("Authorization", "Bearer " + updatedToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Updated Test Employee"))
				.andExpect(jsonPath("$.email").value("updated-employee@example.test"));
	}

	@Test
	void profilePhotoUploadRejectsContentThatDoesNotMatchImageType() throws Exception {
		String employeeToken = authenticate(EMPLOYEE_EMAIL);
		MockMultipartFile fakePng = new MockMultipartFile(
				"file",
				"avatar.png",
				"image/png",
				"not an image".getBytes(java.nio.charset.StandardCharsets.UTF_8)
		);

		mockMvc.perform(multipart("/api/profile/me/photo")
						.file(fakePng)
						.header("Authorization", "Bearer " + employeeToken))
				.andExpect(status().isBadRequest());
	}

	@Test
	void adminCanCreateUpdateAndReadBackAttendance() throws Exception {
		String adminToken = authenticate(ADMIN_EMAIL);
		String employeeToken = authenticate(EMPLOYEE_EMAIL);
		Long employeeId = userRepository.findByEmail(EMPLOYEE_EMAIL)
				.orElseThrow()
				.getId();

		MvcResult markResult = mockMvc.perform(post("/api/attendance")
						.header("Authorization", "Bearer " + adminToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"userId":%d,"date":"2026-10-16","status":"PRESENT"}
								""".formatted(employeeId)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("PRESENT"))
				.andReturn();

		String attendanceId = objectMapper.readTree(
				markResult.getResponse().getContentAsString()
		).get("id").asText();

		mockMvc.perform(post("/api/attendance")
						.header("Authorization", "Bearer " + adminToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"userId":%d,"date":"2026-10-16","status":"LATE"}
								""".formatted(employeeId)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(attendanceId))
				.andExpect(jsonPath("$.status").value("LATE"));

		mockMvc.perform(get("/api/attendance/employee/" + employeeId)
						.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].status").value("LATE"));

		mockMvc.perform(get("/api/attendance/me")
						.header("Authorization", "Bearer " + employeeToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].status").value("LATE"));
	}

	@Test
	void employeeLeaveAndSupportRequestsPersistThroughAdminActions() throws Exception {
		String employeeToken = authenticate(EMPLOYEE_EMAIL);
		String adminToken = authenticate(ADMIN_EMAIL);

		MvcResult leaveResult = mockMvc.perform(post("/api/leaves")
						.header("Authorization", "Bearer " + employeeToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"leaveType":"ANNUAL","startDate":"2026-11-02","endDate":"2026-11-03","reason":"Integration test leave"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("PENDING"))
				.andReturn();
		String leaveId = objectMapper.readTree(
				leaveResult.getResponse().getContentAsString()
		).get("id").asText();

		mockMvc.perform(get("/api/leaves/me")
						.header("Authorization", "Bearer " + employeeToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].reason").value("Integration test leave"));

		mockMvc.perform(get("/api/leaves")
						.header("Authorization", "Bearer " + employeeToken))
				.andExpect(status().isForbidden());

		mockMvc.perform(put("/api/leaves/" + leaveId + "/status")
						.header("Authorization", "Bearer " + adminToken)
						.param("status", "APPROVED"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("APPROVED"));

		mockMvc.perform(get("/api/leaves/me")
						.header("Authorization", "Bearer " + employeeToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].status").value("APPROVED"));

		MvcResult supportResult = mockMvc.perform(post("/api/support")
						.header("Authorization", "Bearer " + employeeToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"subject":"Integration test support","description":"Test-only request"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("PENDING"))
				.andReturn();
		String supportId = objectMapper.readTree(
				supportResult.getResponse().getContentAsString()
		).get("id").asText();

		mockMvc.perform(get("/api/support/me")
						.header("Authorization", "Bearer " + employeeToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].subject").value("Integration test support"));

		mockMvc.perform(get("/api/support")
						.header("Authorization", "Bearer " + employeeToken))
				.andExpect(status().isForbidden());

		mockMvc.perform(put("/api/support/" + supportId + "/resolve")
						.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("RESOLVED"));

		mockMvc.perform(get("/api/support/me")
						.header("Authorization", "Bearer " + employeeToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].status").value("RESOLVED"));
	}

	private User createUser(String name, String email, String role) {
		User user = new User();
		user.setName(name);
		user.setEmail(email);
		user.setPassword(passwordEncoder.encode(TEST_PASSWORD));
		user.setRole(role);
		return user;
	}

	private String authenticate(String email) throws Exception {
		MvcResult result = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginJson(email, TEST_PASSWORD)))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode response = objectMapper.readTree(
				result.getResponse().getContentAsString()
		);
		return response.get("token").asText();
	}

	private String loginJson(String email, String password) {
		return "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
	}
}
