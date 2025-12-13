package com.retailerp.retailerp.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponseDTO {
    private String access_token;
    private String message;
}
