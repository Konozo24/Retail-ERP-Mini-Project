package com.retailerp.retailerp.dto.supplier;

import com.retailerp.retailerp.model.Supplier;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SupplierDTO {

	private Long id;

	private String name;

	private String phone;

	private String email;

	private String address;

	public static SupplierDTO fromEntity(Supplier supplier)
	{
		return SupplierDTO.builder()
			.id(supplier.getId())
			.name(supplier.getName())
			.phone(supplier.getPhone())
			.email(supplier.getEmail())
			.address(supplier.getAddress())
			.build();
	}

}
