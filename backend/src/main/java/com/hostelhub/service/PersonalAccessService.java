package com.hostelhub.service;

import com.hostelhub.dto.MyMaintenanceRequestDto;
import com.hostelhub.dto.MaintenanceRequestResponseDto;
import com.hostelhub.dto.RoomAllocationResponseDto;
import com.hostelhub.dto.UserResponseDto;

import java.util.List;

public interface PersonalAccessService {

    UserResponseDto getMyProfile(String email);

    RoomAllocationResponseDto getMyAllocation(String email);

    List<MaintenanceRequestResponseDto> getMyMaintenanceRequests(
            String email
    );

    MaintenanceRequestResponseDto createMyMaintenanceRequest(
            String email,
            MyMaintenanceRequestDto requestDto
    );

    List<MaintenanceRequestResponseDto> getMyAssignedRequests(
            String email
    );

    MaintenanceRequestResponseDto updateMyAssignedRequestStatus(
            String email,
            Long requestId,
            String status
    );
}