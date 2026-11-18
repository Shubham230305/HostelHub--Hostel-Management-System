package com.hostelhub.dto;

import com.hostelhub.Role.AllocationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RoomAllocationResponseDto {

    private Long id;
    private Long studentId;
    private String studentName;
    private Long roomId;
    private String roomNumber;
    private String hostelName;
    private LocalDate allocationDate;
    private LocalDate vacatedAt;
    private AllocationStatus status;
}