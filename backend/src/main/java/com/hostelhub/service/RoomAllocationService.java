package com.hostelhub.service;

import com.hostelhub.dto.RoomAllocationRequestDto;
import com.hostelhub.dto.RoomAllocationResponseDto;

import java.util.List;

public interface RoomAllocationService {

    RoomAllocationResponseDto allocateRoom(
            RoomAllocationRequestDto requestDto
    );

    List<RoomAllocationResponseDto> getAllAllocations();

    RoomAllocationResponseDto getAllocationById(Long id);

    RoomAllocationResponseDto getStudentAllocation(Long studentId);

    List<RoomAllocationResponseDto> getRoomAllocations(Long roomId);

    RoomAllocationResponseDto vacateRoom(Long allocationId);
}