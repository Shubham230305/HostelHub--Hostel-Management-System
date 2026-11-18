package com.hostelhub.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminDashboardResponseDto {

    private long totalUsers;
    private long totalStudents;
    private long totalMaintenanceStaff;

    private long totalHostels;
    private long totalRooms;

    private long totalActiveAllocations;

    private long totalMaintenanceRequests;
    private long openMaintenanceRequests;
    private long inProgressMaintenanceRequests;
    private long resolvedMaintenanceRequests;
    private long rejectedMaintenanceRequests;
}