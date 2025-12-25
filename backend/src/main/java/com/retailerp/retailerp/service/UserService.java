package com.retailerp.retailerp.service;

import java.util.NoSuchElementException;

import javax.security.auth.login.LoginException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailerp.retailerp.auth.JwtUtil;
import com.retailerp.retailerp.auth.UnauthorizedException;
import com.retailerp.retailerp.dto.auth.AuthRequestDTO;
import com.retailerp.retailerp.dto.auth.AuthResponseDTO;
import com.retailerp.retailerp.dto.user.UserDTO;
import com.retailerp.retailerp.model.User;
import com.retailerp.retailerp.repository.UserRepository;
import com.retailerp.retailerp.repository.spec.UserSpec;

import jakarta.persistence.EntityExistsException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;

	private final JwtUtil jwtUtil;
	private final PasswordEncoder passwordEncoder;

	@Transactional(readOnly = true)
	public Page<UserDTO> getUsers(String search, Pageable pageable) {
		Specification<User> spec = UserSpec.getSpecification(search);
		return userRepository.findAll(spec, pageable)
				.map(UserDTO::fromEntity);
	}

	@Transactional(readOnly = true)
	public UserDTO getUser(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(
				() -> new NoSuchElementException("User with id, " + userId + " doesn't exist!"));
		return UserDTO.fromEntity(user);
	}

	@Transactional
	public void updateUser(Long userId, AuthRequestDTO request) {
		User existing = userRepository.findById(userId).orElseThrow(
				() -> new NoSuchElementException("User with id, " + userId + " doesn't exist!"));

		String cipherText = passwordEncoder.encode(request.getRawPassword());
		existing.setEmail(request.getEmail());
		existing.setCipherText(cipherText);
		userRepository.save(existing);
	}

	@Transactional
	public void removeUser(Long userId) {
		User existing = userRepository.findById(userId).orElseThrow(
				() -> new NoSuchElementException("User with id, " + userId + " doesn't exist!"));

		if (!existing.isInactive()) {
			existing.setInactive(true);
			userRepository.save(existing);
		}
	}

	// --------------------------------------------------
	// | USER AUTH SECTION
	// --------------------------------------------------
	@Transactional(readOnly = true)
	public AuthResponseDTO loginUser(AuthRequestDTO request, HttpServletResponse response) throws LoginException {
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new LoginException("Invalid login credentials"));

		if (passwordEncoder.matches(request.getRawPassword(), user.getCipherText())) {
			String accessToken = jwtUtil.generateAccessToken(user.getId());
			String refreshToken = jwtUtil.generateRefreshToken(user.getId());

			ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
					.httpOnly(true)
					.secure(false) // TODO: set false for local dev if not https, !isLocalEnvironment()
					.path("/auth")
					.maxAge(7 * 24 * 60 * 60) // 7 days
					.sameSite("Strict")
					.build();
			response.addHeader("Set-Cookie", cookie.toString());

			return AuthResponseDTO.builder()
					.access_token(accessToken)
					.email(user.getEmail())
					.role(user.getRole())
					.message("Login successful")
					.build();
		} else {
			throw new LoginException("Invalid login credentials");
		}
	}

	@Transactional
	public AuthResponseDTO registerUser(AuthRequestDTO request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new EntityExistsException("Email already been registered before");
		}
		String cipherText = passwordEncoder.encode(request.getRawPassword());

		User newUser = userRepository.save(
				new User(request.getEmail(), cipherText));

		String token = jwtUtil.generateAccessToken(newUser.getId());

		return AuthResponseDTO.builder()
				.access_token(token)
				.email(newUser.getEmail())
				.role(newUser.getRole())
				.message("User registration successful!")
				.build();
	}

	@Transactional(readOnly = true)
	public void logoutUser(HttpServletResponse response) {
		ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
				.httpOnly(true)
				.secure(true)
				.path("/auth")
				.maxAge(0)
				.build();
		response.addHeader("Set-Cookie", cookie.toString());
	}

	@Transactional(readOnly = true)
	public AuthResponseDTO refreshUserToken(String refreshToken) {
		if (refreshToken == null || refreshToken.isEmpty()) {
			throw new UnauthorizedException("Refresh token missing");
		}

		if (!jwtUtil.validateToken(refreshToken)) {
			throw new UnauthorizedException("Invalid refresh token");
		}

		Long userId = jwtUtil.extractUserId(refreshToken);

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UnauthorizedException("User not found"));

		String newAccessToken = jwtUtil.generateAccessToken(userId);

		return AuthResponseDTO.builder()
				.access_token(newAccessToken)
				.email(user.getEmail())
				.role(user.getRole())
				.message("Token refreshed")
				.build();
	}

}
