package com.retailerp.retailerp.auth;

import javax.security.auth.login.LoginException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.auth.AuthRequestDTO;
import com.retailerp.retailerp.dto.auth.AuthResponseDTO;
import com.retailerp.retailerp.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody AuthRequestDTO request) throws LoginException {
        AuthResponseDTO dto = userService.loginUser(request);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(
            @Valid @RequestBody AuthRequestDTO request) {
        AuthResponseDTO dto = userService.registerUser(request);
        return ResponseEntity.ok(dto);
    }
}
