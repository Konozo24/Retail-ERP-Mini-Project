package com.retailerp.retailerp.dto.category;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    private String Prefix;

    @Nullable
    @Pattern(
        regexp = "^#([A-Fa-f0-9]{6})$",
        message = "Color must be a valid hex code"
    )
    private String color;

}
