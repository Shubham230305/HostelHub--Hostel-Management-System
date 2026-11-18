package com.hostelhub.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class HostelResponseDto {

    private Long id;
    private String name;
    private String address;
    private String wardenName;
    private String contactNumber;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}