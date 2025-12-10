package com.retailerp.retailerp.dto.user;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UserRequestDTO {
    
    @NotBlank
    @Max(20)
    private String username;

    @NotBlank
    @Min(3) // TODO: changehigher
	private String	rawPassword;

}
