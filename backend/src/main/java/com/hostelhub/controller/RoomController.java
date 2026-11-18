package com.hostelhub.controller;

import com.hostelhub.dto.RoomRequestDto;
import com.hostelhub.dto.RoomResponseDto;
import com.hostelhub.service.RoomService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomResponseDto> createRoom(
            @Valid @RequestBody RoomRequestDto roomRequestDto) {

        return new ResponseEntity<>(
                roomService.createRoom(roomRequestDto),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<RoomResponseDto>> getAllRooms() {

        return ResponseEntity.ok(
                roomService.getAllRooms()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponseDto> getRoomById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                roomService.getRoomById(id)
        );
    }

    @GetMapping("/hostel/{hostelId}")
    public ResponseEntity<List<RoomResponseDto>> getRoomsByHostelId(
            @PathVariable Long hostelId) {

        return ResponseEntity.ok(
                roomService.getRoomsByHostelId(hostelId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomResponseDto> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequestDto roomRequestDto) {

        return ResponseEntity.ok(
                roomService.updateRoom(id, roomRequestDto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable Long id) {

        roomService.deleteRoom(id);

        return ResponseEntity.noContent().build();
    }
}
