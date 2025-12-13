package com.retailerp.retailerp.dto.user;

import java.time.OffsetDateTime;

import com.retailerp.retailerp.model.User;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDTO {
    
    private Long id;
    private String email;
    private OffsetDateTime createdAt;

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .email(user.getEmail())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
