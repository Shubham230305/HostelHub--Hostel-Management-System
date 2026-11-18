package com.hostelhub.controller;

import com.hostelhub.dto.AdminDashboardResponseDto;
import com.hostelhub.dto.HostelOccupancyResponseDto;
import com.hostelhub.dto.MaintenanceDashboardResponseDto;
import com.hostelhub.dto.RoomOccupancyResponseDto;
import com.hostelhub.dto.StudentDashboardResponseDto;
import com.hostelhub.service.DashboardService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardResponseDto>
    getAdminDashboard() {

        return ResponseEntity.ok(
                dashboardService.getAdminDashboard()
        );
    }

    @GetMapping("/student")
    public ResponseEntity<StudentDashboardResponseDto>
    getStudentDashboard(
            Authentication authentication) {

        return ResponseEntity.ok(
                dashboardService.getStudentDashboard(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/maintenance")
    public ResponseEntity<MaintenanceDashboardResponseDto>
    getMaintenanceDashboard(
            Authentication authentication) {

        return ResponseEntity.ok(
                dashboardService.getMaintenanceDashboard(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/rooms/occupancy")
    public ResponseEntity<List<RoomOccupancyResponseDto>>
    getRoomOccupancy() {

        return ResponseEntity.ok(
                dashboardService.getRoomOccupancy()
        );
    }

    @GetMapping("/hostels/occupancy")
    public ResponseEntity<List<HostelOccupancyResponseDto>>
    getHostelOccupancy() {

        return ResponseEntity.ok(
                dashboardService.getHostelOccupancy()
        );
    }
}