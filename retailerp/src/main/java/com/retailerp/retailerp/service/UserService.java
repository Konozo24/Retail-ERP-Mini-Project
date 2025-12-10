package com.retailerp.retailerp.service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.security.auth.login.LoginException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailerp.retailerp.auth.AuthRequestDTO;
import com.retailerp.retailerp.auth.AuthResponseDTO;
import com.retailerp.retailerp.auth.JwtUtil;
import com.retailerp.retailerp.dto.user.UserDTO;
import com.retailerp.retailerp.dto.user.UserRequestDTO;
import com.retailerp.retailerp.model.User;
import com.retailerp.retailerp.repository.UserRepository;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public List<UserDTO> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserDTO getUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
            () -> new NoSuchElementException(userId + ". deosnt exist!")
        );
        return UserDTO.fromEntity(user);
    }

    @Transactional
    public void updateUser(Long userId, UserRequestDTO request) {
        User existing = userRepository.findById(userId).orElseThrow(
            () -> new NoSuchElementException(userId + ". deosnt exist!")
        );

        String cipherText = passwordEncoder.encode(request.getRawPassword());
        existing.setUsername(request.getUsername());
        existing.setCipherText(cipherText);
        userRepository.save(existing);
    }

    @Transactional
    public void removeUser(Long userId) {
        userRepository.findById(userId).orElseThrow(
            () -> new NoSuchElementException(userId + ". deosnt exist!")
        );
        userRepository.deleteById(userId);
    }

    //--------------------------------------------------
    //| USER AUTH SECTION
    //--------------------------------------------------
    public AuthResponseDTO loginUser(AuthRequestDTO request) throws LoginException {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new LoginException("Invalid login credentials"));

        if (passwordEncoder.matches(request.getRawPassword(), user.getCipherText())) {
            String token = jwtUtil.generateToken(user.getId());
            return AuthResponseDTO.builder()
                .access_token(token)
                .message("Login successful")
                .build();
        } else {
            throw new LoginException("Invalid login credentials");
        }
    }

    public AuthResponseDTO registerUser(AuthRequestDTO request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new EntityExistsException("Username already been registered before");
        }
        String cipherText = passwordEncoder.encode(request.getRawPassword());

        User newUser = userRepository.save(
            new User(request.getUsername(), cipherText)
        );

        String token = jwtUtil.generateToken(newUser.getId());

        return AuthResponseDTO.builder()
            .access_token(token)
            .message("User registration successful!")
            .build();
    }
}
