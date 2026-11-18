package com.hostelhub.repository;

import com.hostelhub.entity.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HostelRepository extends JpaRepository<Hostel, Long> {

    boolean existsByName(String name);

}