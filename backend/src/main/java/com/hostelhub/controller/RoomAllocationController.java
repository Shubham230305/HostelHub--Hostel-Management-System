package com.hostelhub.controller;

import com.hostelhub.dto.RoomAllocationRequestDto;
import com.hostelhub.dto.RoomAllocationResponseDto;
import com.hostelhub.service.PersonalAccessService;
import com.hostelhub.service.RoomAllocationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class RoomAllocationController {

    private final RoomAllocationService allocationService;
    private final PersonalAccessService personalAccessService;

    @PostMapping
    public ResponseEntity<RoomAllocationResponseDto> allocateRoom(
            @Valid @RequestBody RoomAllocationRequestDto requestDto) {

        return new ResponseEntity<>(
                allocationService.allocateRoom(requestDto),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<RoomAllocationResponseDto>>
    getAllAllocations() {

        return ResponseEntity.ok(
                allocationService.getAllAllocations()
        );
    }

    @GetMapping("/my")
    public ResponseEntity<RoomAllocationResponseDto> getMyAllocation(
            Authentication authentication) {

        return ResponseEntity.ok(
                personalAccessService.getMyAllocation(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomAllocationResponseDto> getAllocationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                allocationService.getAllocationById(id)
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<RoomAllocationResponseDto>
    getStudentAllocation(@PathVariable Long studentId) {

        return ResponseEntity.ok(
                allocationService.getStudentAllocation(studentId)
        );
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<RoomAllocationResponseDto>>
    getRoomAllocations(@PathVariable Long roomId) {

        return ResponseEntity.ok(
                allocationService.getRoomAllocations(roomId)
        );
    }

    @PutMapping("/{allocationId}/vacate")
    public ResponseEntity<RoomAllocationResponseDto> vacateRoom(
            @PathVariable Long allocationId) {

        return ResponseEntity.ok(
                allocationService.vacateRoom(allocationId)
        );
    }
}