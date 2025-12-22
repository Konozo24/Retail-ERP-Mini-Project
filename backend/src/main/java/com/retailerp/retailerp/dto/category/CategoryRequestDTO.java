package com.retailerp.retailerp.dto.category;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryRequestDTO {

	@NotBlank
	@Size(max = 100)
	private String name;

	@NotBlank
	@Size(max = 20)
	private String prefix;

	// Base64 encoded image (optional)
	@Nullable
	private String image;

}
