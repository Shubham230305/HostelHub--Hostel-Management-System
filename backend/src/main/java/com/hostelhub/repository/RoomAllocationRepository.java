package com.hostelhub.repository;

import com.hostelhub.Role.AllocationStatus;
import com.hostelhub.entity.RoomAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomAllocationRepository
        extends JpaRepository<RoomAllocation, Long> {

    boolean existsByStudent_IdAndStatus(
            Long studentId,
            AllocationStatus status
    );

    Optional<RoomAllocation> findByStudent_IdAndStatus(
            Long studentId,
            AllocationStatus status
    );

    Optional<RoomAllocation> findByStudent_IdAndRoom_IdAndStatus(
            Long studentId,
            Long roomId,
            AllocationStatus status
    );

    List<RoomAllocation> findByRoom_IdAndStatus(
            Long roomId,
            AllocationStatus status
    );

    List<RoomAllocation> findByStatus(
            AllocationStatus status
    );

    long countByStatus(
            AllocationStatus status
    );
}