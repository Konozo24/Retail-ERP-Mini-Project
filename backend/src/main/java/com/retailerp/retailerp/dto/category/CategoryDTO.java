package com.retailerp.retailerp.dto.category;

import com.retailerp.retailerp.model.Category;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryDTO {
    
    private long id;
    private String name;
    private String color;
    private Integer productCount;

    public static CategoryDTO fromEntity(Category category) {
        return CategoryDTO.builder()
            .id(category.getId())
            .name(category.getName())
            .color(category.getColor())
            .productCount(category.getProductCount())
            .build();
    }
}
