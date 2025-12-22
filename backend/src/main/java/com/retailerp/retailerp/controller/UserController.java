package com.retailerp.retailerp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.auth.AuthRequestDTO;
import com.retailerp.retailerp.dto.user.UserDTO;
import com.retailerp.retailerp.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@PreAuthorize("hasAuthority('ADMIN')")
@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping("/{userId}")
	public ResponseEntity<UserDTO> getUser(
		@PathVariable Long userId)
	{
		UserDTO dto = userService.getUser(userId);
		return ResponseEntity.ok(dto);
	}

	@PutMapping("/{userId}")
	public ResponseEntity<String> updateUser(
		@PathVariable Long userId,
		@Valid @RequestBody AuthRequestDTO request)
	{
		userService.updateUser(userId, request);
		return ResponseEntity.ok("Update was succesful");
	}

}
