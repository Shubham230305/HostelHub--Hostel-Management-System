package com.hostelhub.serviceImpl;

import com.hostelhub.Role.AllocationStatus;
import com.hostelhub.Role.MaintenanceStatus;
import com.hostelhub.Role.RoleName;
import com.hostelhub.dto.MyMaintenanceRequestDto;
import com.hostelhub.dto.MaintenanceRequestResponseDto;
import com.hostelhub.dto.RoomAllocationResponseDto;
import com.hostelhub.dto.UserResponseDto;
import com.hostelhub.entity.MaintenanceRequest;
import com.hostelhub.entity.Room;
import com.hostelhub.entity.RoomAllocation;
import com.hostelhub.entity.User;
import com.hostelhub.exception.ResourceNotFoundException;
import com.hostelhub.repository.MaintenanceRequestRepository;
import com.hostelhub.repository.RoomAllocationRepository;
import com.hostelhub.repository.RoomRepository;
import com.hostelhub.repository.UserRepository;
import com.hostelhub.service.PersonalAccessService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonalAccessServiceImplementation
        implements PersonalAccessService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomAllocationRepository allocationRepository;
    private final MaintenanceRequestRepository requestRepository;
    private final ModelMapper modelMapper;

    private User getUser(String email) {
        return userRepository.findByEmailWithRole(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        ));
    }

    private void validateRole(User user, RoleName expectedRole) {
        if (!expectedRole.name().equalsIgnoreCase(
                user.getRole().getName())) {
            throw new IllegalArgumentException(
                    "This operation is allowed only for "
                            + expectedRole.name() + " users"
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getMyProfile(String email) {

        User user = getUser(email);

        UserResponseDto response =
                modelMapper.map(user, UserResponseDto.class);

        response.setRole(user.getRole().getName());

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public RoomAllocationResponseDto getMyAllocation(String email) {

        User student = getUser(email);

        validateRole(student, RoleName.STUDENT);

        RoomAllocation allocation =
                allocationRepository.findByStudent_IdAndStatus(
                        student.getId(),
                        AllocationStatus.ACTIVE
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No active room allocation found"
                        ));

        return convertAllocationToResponse(allocation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequestResponseDto>
    getMyMaintenanceRequests(String email) {

        User student = getUser(email);

        validateRole(student, RoleName.STUDENT);

        return requestRepository.findByStudent_Id(student.getId())
                .stream()
                .map(this::convertMaintenanceToResponse)
                .toList();
    }

    @Override
    public MaintenanceRequestResponseDto createMyMaintenanceRequest(
            String email,
            MyMaintenanceRequestDto requestDto) {

        User student = getUser(email);

        validateRole(student, RoleName.STUDENT);

        Room room = roomRepository.findById(requestDto.getRoomId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with id: "
                                        + requestDto.getRoomId()
                        ));

        boolean hasActiveAllocation =
                allocationRepository
                        .findByStudent_IdAndRoom_IdAndStatus(
                                student.getId(),
                                room.getId(),
                                AllocationStatus.ACTIVE
                        )
                        .isPresent();

        if (!hasActiveAllocation) {
            throw new IllegalArgumentException(
                    "You are not currently allocated to this room"
            );
        }

        MaintenanceRequest request = new MaintenanceRequest();

        request.setTitle(requestDto.getTitle());
        request.setDescription(requestDto.getDescription());
        request.setStudent(student);
        request.setRoom(room);
        request.setStatus(MaintenanceStatus.OPEN);

        MaintenanceRequest savedRequest =
                requestRepository.save(request);

        return convertMaintenanceToResponse(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequestResponseDto>
    getMyAssignedRequests(String email) {

        User staff = getUser(email);

        validateRole(staff, RoleName.MAINTENANCE);

        return requestRepository.findByAssignedTo_Id(staff.getId())
                .stream()
                .map(this::convertMaintenanceToResponse)
                .toList();
    }

    @Override
    public MaintenanceRequestResponseDto updateMyAssignedRequestStatus(
            String email,
            Long requestId,
            String status) {

        User staff = getUser(email);

        validateRole(staff, RoleName.MAINTENANCE);

        MaintenanceRequest request =
                requestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Maintenance request not found with id: "
                                                + requestId
                                ));

        if (request.getAssignedTo() == null
                || !request.getAssignedTo().getId()
                .equals(staff.getId())) {

            throw new IllegalArgumentException(
                    "You are not assigned to this maintenance request"
            );
        }

        MaintenanceStatus maintenanceStatus;

        try {
            maintenanceStatus = MaintenanceStatus.valueOf(
                    status.toUpperCase()
            );
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "Invalid maintenance status: " + status
            );
        }

        if (maintenanceStatus == MaintenanceStatus.OPEN) {
            throw new IllegalArgumentException(
                    "Maintenance staff cannot reopen a request"
            );
        }

        request.setStatus(maintenanceStatus);

        if (maintenanceStatus == MaintenanceStatus.RESOLVED) {
            request.setResolvedAt(LocalDateTime.now());
        } else {
            request.setResolvedAt(null);
        }

        return convertMaintenanceToResponse(
                requestRepository.save(request)
        );
    }

    private RoomAllocationResponseDto convertAllocationToResponse(
            RoomAllocation allocation) {

        RoomAllocationResponseDto response =
                new RoomAllocationResponseDto();

        response.setId(allocation.getId());

        response.setStudentId(
                allocation.getStudent().getId()
        );

        response.setStudentName(
                allocation.getStudent().getName()
        );

        response.setRoomId(
                allocation.getRoom().getId()
        );

        response.setRoomNumber(
                allocation.getRoom().getRoomNumber()
        );

        response.setHostelName(
                allocation.getRoom().getHostel().getName()
        );

        response.setAllocationDate(
                allocation.getAllocationDate()
        );

        response.setVacatedAt(
                allocation.getVacatedAt()
        );

        response.setStatus(
                allocation.getStatus()
        );

        return response;
    }

    private MaintenanceRequestResponseDto convertMaintenanceToResponse(
            MaintenanceRequest request) {

        MaintenanceRequestResponseDto response =
                new MaintenanceRequestResponseDto();

        response.setId(request.getId());
        response.setTitle(request.getTitle());
        response.setDescription(request.getDescription());
        response.setStatus(request.getStatus());
        response.setResolvedAt(request.getResolvedAt());

        response.setStudentId(
                request.getStudent().getId()
        );

        response.setStudentName(
                request.getStudent().getName()
        );

        response.setRoomId(
                request.getRoom().getId()
        );

        response.setRoomNumber(
                request.getRoom().getRoomNumber()
        );

        if (request.getAssignedTo() != null) {
            response.setAssignedToId(
                    request.getAssignedTo().getId()
            );

            response.setAssignedToName(
                    request.getAssignedTo().getName()
            );
        }

        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());

        return response;
    }
}