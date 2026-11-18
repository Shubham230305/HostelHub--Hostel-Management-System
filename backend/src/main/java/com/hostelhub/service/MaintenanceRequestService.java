package com.hostelhub.service;

import com.hostelhub.dto.MaintenanceRequestRequestDto;
import com.hostelhub.dto.MaintenanceRequestResponseDto;

import java.util.List;

public interface MaintenanceRequestService {

    MaintenanceRequestResponseDto createRequest(
            MaintenanceRequestRequestDto requestDto
    );

    List<MaintenanceRequestResponseDto> getAllRequests();

    MaintenanceRequestResponseDto getRequestById(Long id);

    List<MaintenanceRequestResponseDto> getStudentRequests(Long studentId);

    List<MaintenanceRequestResponseDto> getRequestsByStatus(String status);

    List<MaintenanceRequestResponseDto> getAssignedRequests(Long staffId);

    MaintenanceRequestResponseDto assignRequest(Long requestId, Long staffId);

    MaintenanceRequestResponseDto updateRequestStatus(
            Long requestId,
            String status
    );

    void deleteRequest(Long id);
}