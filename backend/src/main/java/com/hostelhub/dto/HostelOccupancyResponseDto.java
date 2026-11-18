package com.hostelhub.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HostelOccupancyResponseDto {

    private Long hostelId;
    private String hostelName;

    private long totalRooms;
    private long totalCapacity;
    private long occupiedBeds;
    private long availableBeds;

    private double occupancyPercentage;
}