package com.retailerp.retailerp.dto.customer;

import java.time.format.DateTimeFormatter;

import com.retailerp.retailerp.model.Customer;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CustomerDTO {

	private Long id;

	private String name;

	private String phone;

	private String email;

	private String createdAt;

	public static CustomerDTO fromEntity(Customer customer)
	{
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM yyyy");
		return CustomerDTO.builder()
			.id(customer.getId())
			.name(customer.getName())
			.phone(customer.getPhone())
			.email(customer.getEmail())
			.createdAt(customer.getCreatedAt().format(formatter))
			.build();
	}

}
