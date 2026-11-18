package com.hostelhub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HostelRequestDto {

    @NotBlank(message = "Hostel name is required")
    @Size(max = 100, message = "Hostel name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Hostel address is required")
    private String address;

    @Size(max = 100, message = "Warden name cannot exceed 100 characters")
    private String wardenName;

    @Size(max = 15, message = "Contact number cannot exceed 15 characters")
    private String contactNumber;
}