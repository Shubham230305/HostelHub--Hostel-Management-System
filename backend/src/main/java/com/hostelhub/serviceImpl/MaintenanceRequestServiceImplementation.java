package com.hostelhub.serviceImpl;

import com.hostelhub.Role.MaintenanceStatus;
import com.hostelhub.Role.RoleName;
import com.hostelhub.Role.AllocationStatus;
import com.hostelhub.dto.MaintenanceRequestRequestDto;
import com.hostelhub.dto.MaintenanceRequestResponseDto;
import com.hostelhub.entity.MaintenanceRequest;
import com.hostelhub.entity.Room;
import com.hostelhub.entity.User;
import com.hostelhub.exception.ResourceNotFoundException;
import com.hostelhub.repository.MaintenanceRequestRepository;
import com.hostelhub.repository.RoomAllocationRepository;
import com.hostelhub.repository.RoomRepository;
import com.hostelhub.repository.UserRepository;
import com.hostelhub.service.MaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MaintenanceRequestServiceImplementation
        implements MaintenanceRequestService {

    private final MaintenanceRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomAllocationRepository allocationRepository;

    @Override
    public MaintenanceRequestResponseDto createRequest(
            MaintenanceRequestRequestDto requestDto) {

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
                    "Only students can submit maintenance requests"
            );
        }

        Room room = roomRepository.findById(
                requestDto.getRoomId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Room not found with id: "
                                + requestDto.getRoomId()
                ));

        if (!allocationRepository
                .findByStudent_IdAndRoom_IdAndStatus(
                        student.getId(),
                        room.getId(),
                        AllocationStatus.ACTIVE
                )
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Student is not currently allocated to this room"
            );
        }

        MaintenanceRequest request = new MaintenanceRequest();

        request.setTitle(requestDto.getTitle());
        request.setDescription(requestDto.getDescription());
        request.setStudent(student);
        request.setRoom(room);
        request.setStatus(MaintenanceStatus.OPEN);

        return convertToResponse(requestRepository.save(request));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequestResponseDto> getAllRequests() {
        return requestRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceRequestResponseDto getRequestById(Long id) {
        return convertToResponse(findRequest(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequestResponseDto> getStudentRequests(
            Long studentId) {

        if (!userRepository.existsById(studentId)) {
            throw new ResourceNotFoundException(
                    "Student not found with id: " + studentId
            );
        }

        return requestRepository.findByStudent_Id(studentId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequestResponseDto> getRequestsByStatus(
            String status) {

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

        return requestRepository.findByStatus(maintenanceStatus)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequestResponseDto> getAssignedRequests(
            Long staffId) {

        if (!userRepository.existsById(staffId)) {
            throw new ResourceNotFoundException(
                    "Staff not found with id: " + staffId
            );
        }

        return requestRepository.findByAssignedTo_Id(staffId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public MaintenanceRequestResponseDto assignRequest(
            Long requestId, Long staffId) {

        MaintenanceRequest request = findRequest(requestId);

        User staff = userRepository.findById(staffId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Staff not found with id: " + staffId
                        ));

        if (!RoleName.MAINTENANCE.name().equalsIgnoreCase(
                staff.getRole().getName())) {
            throw new IllegalArgumentException(
                    "Only maintenance staff can be assigned requests"
            );
        }

        request.setAssignedTo(staff);

        return convertToResponse(requestRepository.save(request));
    }

    @Override
    public MaintenanceRequestResponseDto updateRequestStatus(
            Long requestId, String status) {

        MaintenanceRequest request = findRequest(requestId);

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

        request.setStatus(maintenanceStatus);

        if (maintenanceStatus == MaintenanceStatus.RESOLVED) {
            request.setResolvedAt(LocalDateTime.now());
        } else {
            request.setResolvedAt(null);
        }

        return convertToResponse(requestRepository.save(request));
    }

    @Override
    public void deleteRequest(Long id) {
        MaintenanceRequest request = findRequest(id);
        requestRepository.delete(request);
    }

    private MaintenanceRequest findRequest(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Maintenance request not found with id: " + id
                        ));
    }

    private MaintenanceRequestResponseDto convertToResponse(
            MaintenanceRequest request) {

        MaintenanceRequestResponseDto response =
                new MaintenanceRequestResponseDto();

        response.setId(request.getId());
        response.setTitle(request.getTitle());
        response.setDescription(request.getDescription());
        response.setStatus(request.getStatus());
        response.setResolvedAt(request.getResolvedAt());

        response.setStudentId(request.getStudent().getId());
        response.setStudentName(request.getStudent().getName());

        response.setRoomId(request.getRoom().getId());
        response.setRoomNumber(request.getRoom().getRoomNumber());

        if (request.getAssignedTo() != null) {
            response.setAssignedToId(request.getAssignedTo().getId());
            response.setAssignedToName(request.getAssignedTo().getName());
        }

        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());

        return response;
    }
}