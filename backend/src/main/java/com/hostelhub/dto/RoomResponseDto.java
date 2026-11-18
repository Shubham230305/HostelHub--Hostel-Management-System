package com.hostelhub.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RoomResponseDto {

    private Long id;
    private String roomNumber;
    private Integer floorNumber;
    private Integer capacity;
    private Integer occupiedBeds;
    private Boolean isAvailable;
    private Long hostelId;
    private String hostelName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}