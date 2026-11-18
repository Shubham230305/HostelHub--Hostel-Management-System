package com.hostelhub.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomOccupancyResponseDto {

    private Long roomId;
    private String roomNumber;

    private Long hostelId;
    private String hostelName;

    private Integer capacity;
    private Integer occupiedBeds;
    private Integer availableBeds;

    private double occupancyPercentage;
}