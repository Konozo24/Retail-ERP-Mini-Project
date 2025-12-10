package com.retailerp.retailerp.dto.supplier;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SupplierRequestDTO {
    
    @NotBlank
    @Max(100)
    private String name;

    @NotBlank
    @Size(min = 10, max = 20)
    private String phone;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Max(60)
    private String address;

}
