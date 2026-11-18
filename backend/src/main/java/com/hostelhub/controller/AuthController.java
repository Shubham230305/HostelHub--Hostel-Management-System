package com.hostelhub.controller;

import com.hostelhub.dto.Auth.AuthResponseDto;
import com.hostelhub.dto.Auth.LoginRequestDto;
import com.hostelhub.dto.Auth.RegisterRequestDto;
import com.hostelhub.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(
            @Valid @RequestBody RegisterRequestDto requestDto
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.register(requestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(
            @Valid @RequestBody LoginRequestDto requestDto
    ) {

        return ResponseEntity.ok(
                authService.login(requestDto)
        );
    }
}