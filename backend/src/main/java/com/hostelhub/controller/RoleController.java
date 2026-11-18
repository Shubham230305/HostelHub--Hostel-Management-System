package com.hostelhub.controller;

import com.hostelhub.dto.RoleRequestDto;
import com.hostelhub.dto.RoleResponseDto;
import com.hostelhub.service.RoleService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    public ResponseEntity<RoleResponseDto> createRole(
            @Valid @RequestBody RoleRequestDto roleRequestDto) {

        RoleResponseDto response = roleService.createRole(roleRequestDto);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponseDto> getRole(@PathVariable Long id) {

        return ResponseEntity.ok(roleService.getRole(id));
    }

    @GetMapping
    public ResponseEntity<List<RoleResponseDto>> getAllRoles() {

        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleResponseDto> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleRequestDto roleRequestDto) {

        return ResponseEntity.ok(
                roleService.updateRole(id, roleRequestDto)
        );
    }
}