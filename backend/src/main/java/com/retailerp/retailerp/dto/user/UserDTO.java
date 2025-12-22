package com.retailerp.retailerp.dto.user;

import java.time.format.DateTimeFormatter;

import com.retailerp.retailerp.enums.UserRoleEnum;
import com.retailerp.retailerp.model.User;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDTO {

	private Long id;

	private String email;

	private UserRoleEnum role;

	private String createdAt;

	public static UserDTO fromEntity(User user)
	{
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM yyyy");
		return UserDTO.builder()
			.id(user.getId())
			.email(user.getEmail())
			.role(user.getRole())
			.createdAt(user.getCreatedAt().format(formatter))
			.build();
	}

}
