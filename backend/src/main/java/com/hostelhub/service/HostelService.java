package com.hostelhub.service;

import com.hostelhub.dto.HostelRequestDto;
import com.hostelhub.dto.HostelResponseDto;

import java.util.List;

public interface HostelService {

    HostelResponseDto createHostel(HostelRequestDto hostelRequestDto);

    List<HostelResponseDto> getAllHostels();

    HostelResponseDto getHostelById(Long id);

    HostelResponseDto updateHostel(
            Long id,
            HostelRequestDto hostelRequestDto
    );

    void deleteHostel(Long id);
}