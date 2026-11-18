package com.hostelhub.controller;

import com.hostelhub.dto.HostelRequestDto;
import com.hostelhub.dto.HostelResponseDto;
import com.hostelhub.service.HostelService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hostels")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class HostelController {

    private final HostelService hostelService;

    @PostMapping
    public ResponseEntity<HostelResponseDto> createHostel(
            @Valid @RequestBody HostelRequestDto hostelRequestDto) {

        return new ResponseEntity<>(
                hostelService.createHostel(hostelRequestDto),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<HostelResponseDto>> getAllHostels() {

        return ResponseEntity.ok(
                hostelService.getAllHostels()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostelResponseDto> getHostelById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                hostelService.getHostelById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<HostelResponseDto> updateHostel(
            @PathVariable Long id,
            @Valid @RequestBody HostelRequestDto hostelRequestDto) {

        return ResponseEntity.ok(
                hostelService.updateHostel(id, hostelRequestDto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHostel(
            @PathVariable Long id) {

        hostelService.deleteHostel(id);

        return ResponseEntity.noContent().build();
    }
}