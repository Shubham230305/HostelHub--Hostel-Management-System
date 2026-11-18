package com.hostelhub.service;

import com.hostelhub.dto.RoleRequestDto;
import com.hostelhub.dto.RoleResponseDto;

import java.util.List;

public interface RoleService {

    RoleResponseDto createRole(RoleRequestDto roleRequestDto);

    RoleResponseDto getRole(Long id);

    List<RoleResponseDto> getAllRoles();

    RoleResponseDto updateRole(Long id, RoleRequestDto roleRequestDto);
}