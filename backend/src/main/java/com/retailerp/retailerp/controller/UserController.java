package com.retailerp.retailerp.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.PageDTO;
import com.retailerp.retailerp.dto.auth.AuthRequestDTO;
import com.retailerp.retailerp.dto.user.UserDTO;
import com.retailerp.retailerp.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
public class UserController {

	private final UserService userService;

	@GetMapping
	public ResponseEntity<PageDTO<UserDTO>> getUsers(
			@RequestParam(defaultValue = "") String search,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<UserDTO> dtoPage = userService.getUsers(search, pageable);
		return ResponseEntity.ok(PageDTO.fromEntity(dtoPage));
	}

	@GetMapping("/{userId}")
	public ResponseEntity<UserDTO> getUser(
			@PathVariable Long userId) {
		UserDTO dto = userService.getUser(userId);
		return ResponseEntity.ok(dto);
	}

	@PutMapping("/{userId}")
	public ResponseEntity<String> updateUser(
			@PathVariable Long userId,
			@Valid @RequestBody AuthRequestDTO request) {
		userService.updateUser(userId, request);
		return ResponseEntity.ok("Update was succesful");
	}

	@DeleteMapping("/{userId}")
	public ResponseEntity<Void> removeUser(
			@PathVariable Long userId) {
		userService.removeUser(userId);
		return ResponseEntity.noContent().build();
	}

}
