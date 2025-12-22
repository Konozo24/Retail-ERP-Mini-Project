package com.retailerp.retailerp.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
	@Size(min = 6, message = "Password must be at least 6 characters")
	private String rawPassword;

}
