package com.hostelhub.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentDashboardResponseDto {

    private Long studentId;
    private String studentName;
    private String email;

    private RoomAllocationResponseDto allocation;

    private long totalMaintenanceRequests;
    private long openMaintenanceRequests;
    private long inProgressMaintenanceRequests;
    private long resolvedMaintenanceRequests;
    private long rejectedMaintenanceRequests;
}