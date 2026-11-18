package com.hostelhub.dto.Auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponseDto {

    private String accessToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String name;
    private String email;
    private String role;
}