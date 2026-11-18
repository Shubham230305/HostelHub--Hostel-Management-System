package com.hostelhub.dto;

import com.hostelhub.Role.MaintenanceStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MaintenanceRequestResponseDto {

    private Long id;
    private String title;
    private String description;
    private MaintenanceStatus status;
    private LocalDateTime resolvedAt;

    private Long studentId;
    private String studentName;

    private Long roomId;
    private String roomNumber;

    private Long assignedToId;
    private String assignedToName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}