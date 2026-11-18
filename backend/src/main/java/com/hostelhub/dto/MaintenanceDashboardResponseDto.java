package com.hostelhub.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaintenanceDashboardResponseDto {

    private Long staffId;
    private String staffName;
    private String email;

    private long totalAssignedRequests;
    private long openRequests;
    private long inProgressRequests;
    private long resolvedRequests;
    private long rejectedRequests;
}