package com.hostelhub.serviceImpl;

import com.hostelhub.dto.HostelRequestDto;
import com.hostelhub.dto.HostelResponseDto;
import com.hostelhub.entity.Hostel;
import com.hostelhub.exception.ResourceAlreadyExistsException;
import com.hostelhub.exception.ResourceNotFoundException;
import com.hostelhub.repository.HostelRepository;
import com.hostelhub.service.HostelService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HostelServiceImplementation implements HostelService {

    private final HostelRepository hostelRepository;
    private final ModelMapper modelMapper;

    @Override
    public HostelResponseDto createHostel(
            HostelRequestDto hostelRequestDto) {

        if (hostelRepository.existsByName(hostelRequestDto.getName())) {
            throw new ResourceAlreadyExistsException(
                    "Hostel already exists"
            );
        }

        Hostel hostel = new Hostel();

        hostel.setName(hostelRequestDto.getName());
        hostel.setAddress(hostelRequestDto.getAddress());
        hostel.setWardenName(hostelRequestDto.getWardenName());
        hostel.setContactNumber(hostelRequestDto.getContactNumber());

        Hostel savedHostel = hostelRepository.save(hostel);

        return modelMapper.map(
                savedHostel,
                HostelResponseDto.class
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelResponseDto> getAllHostels() {

        return hostelRepository.findAll()
                .stream()
                .map(hostel ->
                        modelMapper.map(
                                hostel,
                                HostelResponseDto.class
                        ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HostelResponseDto getHostelById(Long id) {

        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hostel not found with id: " + id
                        ));

        return modelMapper.map(
                hostel,
                HostelResponseDto.class
        );
    }

    @Override
    public HostelResponseDto updateHostel(
            Long id,
            HostelRequestDto hostelRequestDto) {

        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hostel not found with id: " + id
                        ));

        if (!hostel.getName().equals(hostelRequestDto.getName())
                && hostelRepository.existsByName(
                hostelRequestDto.getName())) {

            throw new ResourceAlreadyExistsException(
                    "Hostel name already exists"
            );
        }

        hostel.setName(hostelRequestDto.getName());
        hostel.setAddress(hostelRequestDto.getAddress());
        hostel.setWardenName(hostelRequestDto.getWardenName());
        hostel.setContactNumber(hostelRequestDto.getContactNumber());

        Hostel updatedHostel = hostelRepository.save(hostel);

        return modelMapper.map(
                updatedHostel,
                HostelResponseDto.class
        );
    }

    @Override
    public void deleteHostel(Long id) {

        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hostel not found with id: " + id
                        ));

        hostelRepository.delete(hostel);
    }
}