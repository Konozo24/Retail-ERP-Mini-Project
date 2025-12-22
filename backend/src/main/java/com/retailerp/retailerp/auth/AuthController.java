package com.retailerp.retailerp.auth;

import javax.security.auth.login.LoginException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.auth.AuthRequestDTO;
import com.retailerp.retailerp.dto.auth.AuthResponseDTO;
import com.retailerp.retailerp.service.UserService;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UserService userService;

	@PostMapping("/login")
	public ResponseEntity<AuthResponseDTO> login(
		@Valid @RequestBody AuthRequestDTO request,
		HttpServletResponse response) throws LoginException
	{
		AuthResponseDTO dto = userService.loginUser(request, response);
		return ResponseEntity.ok(dto);
	}

	@PostMapping("/logout")
	public ResponseEntity<String> logout(HttpServletResponse response)
	{
		userService.logoutUser(response);
		return ResponseEntity.ok("Logged out");
	}

	@PostMapping("/refresh")
	public ResponseEntity<AuthResponseDTO> refreshToken(
		@Parameter(hidden = true) @CookieValue("refreshToken") String refreshToken)
	{
		AuthResponseDTO dto = userService.refreshUserToken(refreshToken);
		return ResponseEntity.ok(dto);
	}

}
