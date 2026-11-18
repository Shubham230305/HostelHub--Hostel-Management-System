package com.hostelhub.serviceImpl;

import com.hostelhub.dto.RoomRequestDto;
import com.hostelhub.dto.RoomResponseDto;
import com.hostelhub.entity.Hostel;
import com.hostelhub.entity.Room;
import com.hostelhub.exception.ResourceAlreadyExistsException;
import com.hostelhub.exception.ResourceNotFoundException;
import com.hostelhub.repository.HostelRepository;
import com.hostelhub.repository.RoomRepository;
import com.hostelhub.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomServiceImplementation implements RoomService {

    private final RoomRepository roomRepository;
    private final HostelRepository hostelRepository;
    private final ModelMapper modelMapper;

    @Override
    public RoomResponseDto createRoom(RoomRequestDto roomRequestDto) {

        Hostel hostel = hostelRepository.findById(
                roomRequestDto.getHostelId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Hostel not found with id: "
                                + roomRequestDto.getHostelId()
                ));

        if (roomRepository.existsByRoomNumberAndHostelId(
                roomRequestDto.getRoomNumber(),
                roomRequestDto.getHostelId())) {

            throw new ResourceAlreadyExistsException(
                    "Room number already exists in this hostel"
            );
        }

        Room room = new Room();

        room.setRoomNumber(roomRequestDto.getRoomNumber());
        room.setFloorNumber(roomRequestDto.getFloorNumber());
        room.setCapacity(roomRequestDto.getCapacity());
        room.setHostel(hostel);

        Room savedRoom = roomRepository.save(room);

        return convertToResponse(savedRoom);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponseDto> getAllRooms() {

        return roomRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponseDto getRoomById(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with id: " + id
                        ));

        return convertToResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponseDto> getRoomsByHostelId(Long hostelId) {

        if (!hostelRepository.existsById(hostelId)) {
            throw new ResourceNotFoundException(
                    "Hostel not found with id: " + hostelId
            );
        }

        return roomRepository.findByHostelId(hostelId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public RoomResponseDto updateRoom(
            Long id,
            RoomRequestDto roomRequestDto) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with id: " + id
                        ));

        Hostel hostel = hostelRepository.findById(
                roomRequestDto.getHostelId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Hostel not found with id: "
                                + roomRequestDto.getHostelId()
                ));

        if (!room.getRoomNumber().equals(roomRequestDto.getRoomNumber())
                || !room.getHostel().getId().equals(
                roomRequestDto.getHostelId())) {

            if (roomRepository.existsByRoomNumberAndHostelId(
                    roomRequestDto.getRoomNumber(),
                    roomRequestDto.getHostelId())) {

                throw new ResourceAlreadyExistsException(
                        "Room number already exists in this hostel"
                );
            }
        }

        if (roomRequestDto.getCapacity() < room.getOccupiedBeds()) {
            throw new IllegalArgumentException(
                    "Room capacity cannot be less than occupied beds"
            );
        }

        room.setRoomNumber(roomRequestDto.getRoomNumber());
        room.setFloorNumber(roomRequestDto.getFloorNumber());
        room.setCapacity(roomRequestDto.getCapacity());
        room.setHostel(hostel);

        Room updatedRoom = roomRepository.save(room);

        return convertToResponse(updatedRoom);
    }

    @Override
    public void deleteRoom(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with id: " + id
                        ));

        roomRepository.delete(room);
    }

    private RoomResponseDto convertToResponse(Room room) {

        RoomResponseDto responseDto =
                modelMapper.map(room, RoomResponseDto.class);

        responseDto.setHostelId(room.getHostel().getId());
        responseDto.setHostelName(room.getHostel().getName());

        return responseDto;
    }
}
