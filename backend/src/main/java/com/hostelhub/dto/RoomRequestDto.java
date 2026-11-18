package com.hostelhub.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomRequestDto {

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotNull(message = "Floor number is required")
    @Min(value = 0, message = "Floor number cannot be negative")
    private Integer floorNumber;

    @NotNull(message = "Room capacity is required")
    @Min(value = 1, message = "Room capacity must be at least 1")
    private Integer capacity;

    @NotNull(message = "Hostel ID is required")
    private Long hostelId;
}