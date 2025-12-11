package com.retailerp.retailerp.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class AuthRequestDTO {

    @NotBlank
    private String username;

    @NotBlank
    private String rawPassword;
}
