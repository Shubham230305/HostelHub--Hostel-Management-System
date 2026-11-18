package com.hostelhub.service;

import com.hostelhub.dto.AdminDashboardResponseDto;
import com.hostelhub.dto.HostelOccupancyResponseDto;
import com.hostelhub.dto.MaintenanceDashboardResponseDto;
import com.hostelhub.dto.RoomOccupancyResponseDto;
import com.hostelhub.dto.StudentDashboardResponseDto;

import java.util.List;

public interface DashboardService {

    AdminDashboardResponseDto getAdminDashboard();

    StudentDashboardResponseDto getStudentDashboard(String email);

    MaintenanceDashboardResponseDto getMaintenanceDashboard(
            String email
    );

    List<RoomOccupancyResponseDto> getRoomOccupancy();

    List<HostelOccupancyResponseDto> getHostelOccupancy();
}