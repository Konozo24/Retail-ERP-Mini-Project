package com.retailerp.retailerp.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
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

    @Schema(example = "user@gmail.com")
    @NotBlank
    @Email
    private String email;

    @Schema(example = "password")
    @NotBlank
    private String rawPassword;
}
