package com.hostelhub.service;

import com.hostelhub.dto.RoomRequestDto;
import com.hostelhub.dto.RoomResponseDto;

import java.util.List;

public interface RoomService {

    RoomResponseDto createRoom(RoomRequestDto roomRequestDto);

    List<RoomResponseDto> getAllRooms();

    RoomResponseDto getRoomById(Long id);

    List<RoomResponseDto> getRoomsByHostelId(Long hostelId);

    RoomResponseDto updateRoom(Long id, RoomRequestDto roomRequestDto);

    void deleteRoom(Long id);
}
