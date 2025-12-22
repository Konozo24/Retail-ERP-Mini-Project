package com.retailerp.retailerp.dto.auth;

import com.retailerp.retailerp.enums.UserRoleEnum;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponseDTO {

	private String access_token;

	private Long id;

	private String message;

	private String email;

	private UserRoleEnum role;

}
