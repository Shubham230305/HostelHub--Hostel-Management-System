package com.hostelhub.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponseDto {

    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String address;
    private LocalDate dateOfBirth;
    private Boolean isActive;
    private Boolean emailVerified;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
