package com.hostelhub.controller;

import com.hostelhub.dto.Auth.AuthResponseDto;
import com.hostelhub.dto.Auth.SetupRequestDto;
import com.hostelhub.service.SetupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/setup")
@RequiredArgsConstructor
public class SetupController {

    private final SetupService setupService;

    @GetMapping("/status")
    public ResponseEntity<Boolean> setupStatus() {
        return ResponseEntity.ok(setupService.isSetupRequired());
    }

    @PostMapping("/initialize")
    public ResponseEntity<AuthResponseDto> initialize(
            @Valid @RequestBody SetupRequestDto requestDto
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(setupService.initialize(requestDto));
    }
}