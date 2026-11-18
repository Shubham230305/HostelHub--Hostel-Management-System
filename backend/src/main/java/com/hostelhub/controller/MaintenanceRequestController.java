package com.hostelhub.controller;

import com.hostelhub.dto.MaintenanceRequestRequestDto;
import com.hostelhub.dto.MaintenanceRequestResponseDto;
import com.hostelhub.dto.MyMaintenanceRequestDto;
import com.hostelhub.service.MaintenanceRequestService;
import com.hostelhub.service.PersonalAccessService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class MaintenanceRequestController {

    private final MaintenanceRequestService requestService;
    private final PersonalAccessService personalAccessService;

    @PostMapping
    public ResponseEntity<MaintenanceRequestResponseDto> createRequest(
            @Valid @RequestBody MaintenanceRequestRequestDto requestDto) {

        return new ResponseEntity<>(
                requestService.createRequest(requestDto),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/my")
    public ResponseEntity<MaintenanceRequestResponseDto>
    createMyRequest(
            @Valid @RequestBody MyMaintenanceRequestDto requestDto,
            Authentication authentication) {

        return new ResponseEntity<>(
                personalAccessService.createMyMaintenanceRequest(
                        authentication.getName(),
                        requestDto
                ),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceRequestResponseDto>>
    getAllRequests() {

        return ResponseEntity.ok(
                requestService.getAllRequests()
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<MaintenanceRequestResponseDto>>
    getMyRequests(Authentication authentication) {

        return ResponseEntity.ok(
                personalAccessService.getMyMaintenanceRequests(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/my-assigned")
    public ResponseEntity<List<MaintenanceRequestResponseDto>>
    getMyAssignedRequests(Authentication authentication) {

        return ResponseEntity.ok(
                personalAccessService.getMyAssignedRequests(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequestResponseDto> getRequestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                requestService.getRequestById(id)
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<MaintenanceRequestResponseDto>>
    getStudentRequests(@PathVariable Long studentId) {

        return ResponseEntity.ok(
                requestService.getStudentRequests(studentId)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<MaintenanceRequestResponseDto>>
    getRequestsByStatus(@PathVariable String status) {

        return ResponseEntity.ok(
                requestService.getRequestsByStatus(status)
        );
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<MaintenanceRequestResponseDto>>
    getAssignedRequests(@PathVariable Long staffId) {

        return ResponseEntity.ok(
                requestService.getAssignedRequests(staffId)
        );
    }

    @PutMapping("/{requestId}/assign/{staffId}")
    public ResponseEntity<MaintenanceRequestResponseDto> assignRequest(
            @PathVariable Long requestId,
            @PathVariable Long staffId) {

        return ResponseEntity.ok(
                requestService.assignRequest(requestId, staffId)
        );
    }

    @PutMapping("/{requestId}/status/{status}")
    public ResponseEntity<MaintenanceRequestResponseDto>
    updateRequestStatus(
            @PathVariable Long requestId,
            @PathVariable String status) {

        return ResponseEntity.ok(
                requestService.updateRequestStatus(requestId, status)
        );
    }

    @PutMapping("/{requestId}/my-status/{status}")
    public ResponseEntity<MaintenanceRequestResponseDto>
    updateMyRequestStatus(
            @PathVariable Long requestId,
            @PathVariable String status,
            Authentication authentication) {

        return ResponseEntity.ok(
                personalAccessService.updateMyAssignedRequestStatus(
                        authentication.getName(),
                        requestId,
                        status
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(
            @PathVariable Long id) {

        requestService.deleteRequest(id);

        return ResponseEntity.noContent().build();
    }
}