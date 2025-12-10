package com.retailerp.retailerp.controller;

import java.util.List;

import javax.security.auth.login.LoginException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.auth.AuthRequestDTO;
import com.retailerp.retailerp.auth.AuthResponseDTO;
import com.retailerp.retailerp.dto.user.UserDTO;
import com.retailerp.retailerp.dto.user.UserRequestDTO;
import com.retailerp.retailerp.service.UserService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsers() {
        List<UserDTO> dtoList = userService.getUsers();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUser(
        @PathVariable Long userId
    ) {
        UserDTO dto = userService.getUser(userId);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Void> updateUser(
        @PathVariable Long userId,
        @Valid @RequestBody UserRequestDTO request
    ) {
        userService.updateUser(userId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeUser(
        @PathVariable Long userId
    ) {
        userService.removeUser(userId);
        return ResponseEntity.noContent().build();
    }

    //--------------------------------------------------
    //| USER AUTH SECTION
    //--------------------------------------------------
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody AuthRequestDTO request) throws LoginException {
        AuthResponseDTO dto = userService.loginUser(request);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<AuthResponseDTO> register(
            @Valid @RequestBody AuthRequestDTO request) {
        AuthResponseDTO dto = userService.registerUser(request);
        return ResponseEntity.ok(dto);
    }
}
