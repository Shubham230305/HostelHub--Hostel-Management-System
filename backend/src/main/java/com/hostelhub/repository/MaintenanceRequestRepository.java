package com.hostelhub.repository;

import com.hostelhub.Role.MaintenanceStatus;
import com.hostelhub.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository
        extends JpaRepository<MaintenanceRequest, Long> {

    List<MaintenanceRequest> findByStudent_Id(Long studentId);

    List<MaintenanceRequest> findByStatus(MaintenanceStatus status);

    List<MaintenanceRequest> findByAssignedTo_Id(Long staffId);

    long countByStatus(MaintenanceStatus status);

    long countByStudent_Id(Long studentId);

    long countByStudent_IdAndStatus(
            Long studentId,
            MaintenanceStatus status
    );

    long countByAssignedTo_Id(Long staffId);

    long countByAssignedTo_IdAndStatus(
            Long staffId,
            MaintenanceStatus status
    );
}