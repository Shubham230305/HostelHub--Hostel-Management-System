package com.hostelhub.serviceImpl;

import com.hostelhub.Role.AllocationStatus;
import com.hostelhub.Role.RoleName;
import com.hostelhub.dto.RoomAllocationRequestDto;
import com.hostelhub.dto.RoomAllocationResponseDto;
import com.hostelhub.entity.Room;
import com.hostelhub.entity.RoomAllocation;
import com.hostelhub.entity.User;
import com.hostelhub.exception.ResourceAlreadyExistsException;
import com.hostelhub.exception.ResourceNotFoundException;
import com.hostelhub.repository.RoomAllocationRepository;
import com.hostelhub.repository.RoomRepository;
import com.hostelhub.repository.UserRepository;
import com.hostelhub.service.RoomAllocationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomAllocationServiceImplementation
        implements RoomAllocationService {

    private final RoomAllocationRepository allocationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public RoomAllocationResponseDto allocateRoom(
            RoomAllocationRequestDto requestDto) {

        User student = userRepository.findById(
                requestDto.getStudentId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Student not found with id: "
                                + requestDto.getStudentId()
                ));

        if (!RoleName.STUDENT.name().equalsIgnoreCase(
                student.getRole().getName())) {

            throw new IllegalArgumentException(
                    "Only users with STUDENT role can be allocated a room"
            );
        }

        if (allocationRepository.existsByStudent_IdAndStatus(
                student.getId(),
                AllocationStatus.ACTIVE)) {

            throw new ResourceAlreadyExistsException(
                    "Student already has an active room allocation"
            );
        }

        Room room = roomRepository.findById(
                requestDto.getRoomId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Room not found with id: "
                                + requestDto.getRoomId()
                ));

        if (room.getOccupiedBeds() >= room.getCapacity()) {
            throw new IllegalArgumentException(
                    "Room is already full"
            );
        }

        RoomAllocation allocation = new RoomAllocation();

        allocation.setStudent(student);
        allocation.setRoom(room);
        allocation.setAllocationDate(LocalDate.now());
        allocation.setStatus(AllocationStatus.ACTIVE);

        room.setOccupiedBeds(room.getOccupiedBeds() + 1);
        room.setIsAvailable(
                room.getOccupiedBeds() < room.getCapacity()
        );

        roomRepository.save(room);

        RoomAllocation savedAllocation =
                allocationRepository.save(allocation);

        return convertToResponse(savedAllocation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomAllocationResponseDto> getAllAllocations() {

        return allocationRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoomAllocationResponseDto getAllocationById(Long id) {

        RoomAllocation allocation = allocationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Allocation not found with id: " + id
                        ));

        return convertToResponse(allocation);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomAllocationResponseDto getStudentAllocation(
            Long studentId) {

        RoomAllocation allocation =
                allocationRepository.findByStudent_IdAndStatus(
                        studentId,
                        AllocationStatus.ACTIVE
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No active allocation found for student: "
                                        + studentId
                        ));

        return convertToResponse(allocation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomAllocationResponseDto> getRoomAllocations(
            Long roomId) {

        if (!roomRepository.existsById(roomId)) {
            throw new ResourceNotFoundException(
                    "Room not found with id: " + roomId
            );
        }

        return allocationRepository.findByRoom_IdAndStatus(
                        roomId,
                        AllocationStatus.ACTIVE
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public RoomAllocationResponseDto vacateRoom(Long allocationId) {

        RoomAllocation allocation =
                allocationRepository.findById(allocationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Allocation not found with id: "
                                                + allocationId
                                ));

        if (allocation.getStatus() == AllocationStatus.VACATED) {
            throw new IllegalArgumentException(
                    "This room allocation is already vacated"
            );
        }

        Room room = allocation.getRoom();

        allocation.setStatus(AllocationStatus.VACATED);
        allocation.setVacatedAt(LocalDate.now());

        room.setOccupiedBeds(
                Math.max(0, room.getOccupiedBeds() - 1)
        );

        room.setIsAvailable(
                room.getOccupiedBeds() < room.getCapacity()
        );

        roomRepository.save(room);

        return convertToResponse(
                allocationRepository.save(allocation)
        );
    }

    private RoomAllocationResponseDto convertToResponse(
            RoomAllocation allocation) {

        RoomAllocationResponseDto responseDto =
                modelMapper.map(
                        allocation,
                        RoomAllocationResponseDto.class
                );

        responseDto.setStudentId(
                allocation.getStudent().getId()
        );

        responseDto.setStudentName(
                allocation.getStudent().getName()
        );

        responseDto.setRoomId(
                allocation.getRoom().getId()
        );

        responseDto.setRoomNumber(
                allocation.getRoom().getRoomNumber()
        );

        responseDto.setHostelName(
                allocation.getRoom().getHostel().getName()
        );

        return responseDto;
    }
}