package com.retailerp.retailerp.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponseDTO {
    private String access_token;
    private String message;
}
