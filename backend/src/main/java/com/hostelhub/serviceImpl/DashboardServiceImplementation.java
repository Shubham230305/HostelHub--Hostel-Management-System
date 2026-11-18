package com.hostelhub.serviceImpl;

import com.hostelhub.Role.AllocationStatus;
import com.hostelhub.Role.MaintenanceStatus;
import com.hostelhub.Role.RoleName;
import com.hostelhub.dto.AdminDashboardResponseDto;
import com.hostelhub.dto.HostelOccupancyResponseDto;
import com.hostelhub.dto.MaintenanceDashboardResponseDto;
import com.hostelhub.dto.RoomAllocationResponseDto;
import com.hostelhub.dto.RoomOccupancyResponseDto;
import com.hostelhub.dto.StudentDashboardResponseDto;
import com.hostelhub.entity.Hostel;
import com.hostelhub.entity.Room;
import com.hostelhub.entity.RoomAllocation;
import com.hostelhub.entity.User;
import com.hostelhub.exception.ResourceNotFoundException;
import com.hostelhub.repository.HostelRepository;
import com.hostelhub.repository.MaintenanceRequestRepository;
import com.hostelhub.repository.RoomAllocationRepository;
import com.hostelhub.repository.RoomRepository;
import com.hostelhub.repository.UserRepository;
import com.hostelhub.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImplementation
        implements DashboardService {

    private final UserRepository userRepository;
    private final HostelRepository hostelRepository;
    private final RoomRepository roomRepository;
    private final RoomAllocationRepository allocationRepository;
    private final MaintenanceRequestRepository maintenanceRepository;

    @Override
    public AdminDashboardResponseDto getAdminDashboard() {

        AdminDashboardResponseDto response =
                new AdminDashboardResponseDto();

        response.setTotalUsers(userRepository.count());

        response.setTotalStudents(
                userRepository.countByRole_Name(
                        RoleName.STUDENT.name()
                )
        );

        response.setTotalMaintenanceStaff(
                userRepository.countByRole_Name(
                        RoleName.MAINTENANCE.name()
                )
        );

        response.setTotalHostels(
                hostelRepository.count()
        );

        response.setTotalRooms(
                roomRepository.count()
        );

        response.setTotalActiveAllocations(
                allocationRepository.countByStatus(
                        AllocationStatus.ACTIVE
                )
        );

        response.setTotalMaintenanceRequests(
                maintenanceRepository.count()
        );

        response.setOpenMaintenanceRequests(
                maintenanceRepository.countByStatus(
                        MaintenanceStatus.OPEN
                )
        );

        response.setInProgressMaintenanceRequests(
                maintenanceRepository.countByStatus(
                        MaintenanceStatus.IN_PROGRESS
                )
        );

        response.setResolvedMaintenanceRequests(
                maintenanceRepository.countByStatus(
                        MaintenanceStatus.RESOLVED
                )
        );

        response.setRejectedMaintenanceRequests(
                maintenanceRepository.countByStatus(
                        MaintenanceStatus.REJECTED
                )
        );

        return response;
    }

    @Override
    public StudentDashboardResponseDto getStudentDashboard(
            String email) {

        User student = userRepository.findByEmailWithRole(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        ));

        validateRole(student, RoleName.STUDENT);

        StudentDashboardResponseDto response =
                new StudentDashboardResponseDto();

        response.setStudentId(student.getId());
        response.setStudentName(student.getName());
        response.setEmail(student.getEmail());

        allocationRepository.findByStudent_IdAndStatus(
                        student.getId(),
                        AllocationStatus.ACTIVE
                )
                .ifPresent(allocation ->
                        response.setAllocation(
                                convertAllocationToResponse(allocation)
                        )
                );

        response.setTotalMaintenanceRequests(
                maintenanceRepository.countByStudent_Id(
                        student.getId()
                )
        );

        response.setOpenMaintenanceRequests(
                maintenanceRepository.countByStudent_IdAndStatus(
                        student.getId(),
                        MaintenanceStatus.OPEN
                )
        );

        response.setInProgressMaintenanceRequests(
                maintenanceRepository.countByStudent_IdAndStatus(
                        student.getId(),
                        MaintenanceStatus.IN_PROGRESS
                )
        );

        response.setResolvedMaintenanceRequests(
                maintenanceRepository.countByStudent_IdAndStatus(
                        student.getId(),
                        MaintenanceStatus.RESOLVED
                )
        );

        response.setRejectedMaintenanceRequests(
                maintenanceRepository.countByStudent_IdAndStatus(
                        student.getId(),
                        MaintenanceStatus.REJECTED
                )
        );

        return response;
    }

    @Override
    public MaintenanceDashboardResponseDto
    getMaintenanceDashboard(String email) {

        User staff = userRepository.findByEmailWithRole(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        ));

        validateRole(staff, RoleName.MAINTENANCE);

        MaintenanceDashboardResponseDto response =
                new MaintenanceDashboardResponseDto();

        response.setStaffId(staff.getId());
        response.setStaffName(staff.getName());
        response.setEmail(staff.getEmail());

        response.setTotalAssignedRequests(
                maintenanceRepository.countByAssignedTo_Id(
                        staff.getId()
                )
        );

        response.setOpenRequests(
                maintenanceRepository.countByAssignedTo_IdAndStatus(
                        staff.getId(),
                        MaintenanceStatus.OPEN
                )
        );

        response.setInProgressRequests(
                maintenanceRepository.countByAssignedTo_IdAndStatus(
                        staff.getId(),
                        MaintenanceStatus.IN_PROGRESS
                )
        );

        response.setResolvedRequests(
                maintenanceRepository.countByAssignedTo_IdAndStatus(
                        staff.getId(),
                        MaintenanceStatus.RESOLVED
                )
        );

        response.setRejectedRequests(
                maintenanceRepository.countByAssignedTo_IdAndStatus(
                        staff.getId(),
                        MaintenanceStatus.REJECTED
                )
        );

        return response;
    }

    @Override
    public List<RoomOccupancyResponseDto> getRoomOccupancy() {

        return roomRepository.findAll()
                .stream()
                .map(this::convertRoomOccupancy)
                .toList();
    }

    @Override
    public List<HostelOccupancyResponseDto> getHostelOccupancy() {

        List<Hostel> hostels = hostelRepository.findAll();

        List<Room> rooms = roomRepository.findAll();

        Map<Long, List<Room>> roomsByHostel =
                rooms.stream()
                        .collect(Collectors.groupingBy(
                                room -> room.getHostel().getId()
                        ));

        return hostels.stream()
                .map(hostel -> {

                    List<Room> hostelRooms =
                            roomsByHostel.getOrDefault(
                                    hostel.getId(),
                                    List.of()
                            );

                    long totalCapacity =
                            hostelRooms.stream()
                                    .mapToLong(
                                            room -> room.getCapacity()
                                    )
                                    .sum();

                    long occupiedBeds =
                            hostelRooms.stream()
                                    .mapToLong(
                                            room -> room.getOccupiedBeds()
                                    )
                                    .sum();

                    long availableBeds =
                            Math.max(
                                    0,
                                    totalCapacity - occupiedBeds
                            );

                    HostelOccupancyResponseDto response =
                            new HostelOccupancyResponseDto();

                    response.setHostelId(hostel.getId());
                    response.setHostelName(hostel.getName());
                    response.setTotalRooms(hostelRooms.size());
                    response.setTotalCapacity(totalCapacity);
                    response.setOccupiedBeds(occupiedBeds);
                    response.setAvailableBeds(availableBeds);
                    response.setOccupancyPercentage(
                            calculatePercentage(
                                    occupiedBeds,
                                    totalCapacity
                            )
                    );

                    return response;
                })
                .toList();
    }

    private RoomOccupancyResponseDto convertRoomOccupancy(
            Room room) {

        int capacity = room.getCapacity();
        int occupiedBeds = room.getOccupiedBeds();

        int availableBeds =
                Math.max(0, capacity - occupiedBeds);

        RoomOccupancyResponseDto response =
                new RoomOccupancyResponseDto();

        response.setRoomId(room.getId());
        response.setRoomNumber(room.getRoomNumber());

        response.setHostelId(
                room.getHostel().getId()
        );

        response.setHostelName(
                room.getHostel().getName()
        );

        response.setCapacity(capacity);
        response.setOccupiedBeds(occupiedBeds);
        response.setAvailableBeds(availableBeds);

        response.setOccupancyPercentage(
                calculatePercentage(
                        occupiedBeds,
                        capacity
                )
        );

        return response;
    }

    private double calculatePercentage(
            long occupied,
            long capacity) {

        if (capacity == 0) {
            return 0.0;
        }

        return Math.round(
                (occupied * 10000.0) / capacity
        ) / 100.0;
    }

    private RoomAllocationResponseDto
    convertAllocationToResponse(
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
                allocation.getRoom()
                        .getHostel()
                        .getName()
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

    private void validateRole(
            User user,
            RoleName expectedRole) {

        if (!expectedRole.name().equalsIgnoreCase(
                user.getRole().getName())) {

            throw new IllegalArgumentException(
                    "This operation is allowed only for "
                            + expectedRole.name()
                            + " users"
            );
        }
    }
}