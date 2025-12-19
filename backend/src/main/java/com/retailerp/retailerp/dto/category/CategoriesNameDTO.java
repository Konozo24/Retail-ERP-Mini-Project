package com.retailerp.retailerp.dto.category;

import java.util.List;

import com.retailerp.retailerp.model.Category;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoriesNameDTO {
    
    List<String> names;

    public static CategoriesNameDTO fromEntity(List<Category> categories) {
        return CategoriesNameDTO.builder()
            .names(
                categories.stream()
                    .map(cat -> cat.getName())
                    .toList()
            )
            .build();
    }

}
