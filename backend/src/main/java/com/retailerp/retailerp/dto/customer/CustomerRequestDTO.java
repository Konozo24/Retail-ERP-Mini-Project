package com.retailerp.retailerp.dto.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class CustomerRequestDTO {

	@NotBlank
	@Size(max = 100)
	private String name;

	@NotBlank
	@Pattern(
		regexp = "^\\+?6?(?:01[0-46-9]\\d{7,8}|0\\d{8})$",
		message = "Invalid phone number format. Example: +60123456789 or 0123456789")
	private String phone;

	@NotBlank
	@Email
	private String email;

}
