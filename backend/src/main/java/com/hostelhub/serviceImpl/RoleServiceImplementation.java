package com.hostelhub.serviceImpl;

import com.hostelhub.dto.RoleRequestDto;
import com.hostelhub.dto.RoleResponseDto;
import com.hostelhub.entity.Role;
import com.hostelhub.exception.ResourceAlreadyExistsException;
import com.hostelhub.exception.ResourceNotFoundException;
import com.hostelhub.repository.RoleRepository;
import com.hostelhub.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImplementation implements RoleService {

    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;

    @Override
    public RoleResponseDto createRole(RoleRequestDto roleRequestDto) {

        if (roleRepository.existsByName(roleRequestDto.getName())) {
            throw new ResourceAlreadyExistsException("Role already exists");
        }

        Role role = modelMapper.map(roleRequestDto, Role.class);

        Role savedRole = roleRepository.save(role);

        return modelMapper.map(savedRole, RoleResponseDto.class);
    }

    @Override
    public RoleResponseDto getRole(Long id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found with id: " + id
                        ));

        return modelMapper.map(role, RoleResponseDto.class);
    }

    @Override
    public List<RoleResponseDto> getAllRoles() {

        return roleRepository.findAll()
                .stream()
                .map(role -> modelMapper.map(role, RoleResponseDto.class))
                .toList();
    }

    @Override
    public RoleResponseDto updateRole(
            Long id,
            RoleRequestDto roleRequestDto) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found with id: " + id
                        ));

        if (!role.getName().equals(roleRequestDto.getName())
                && roleRepository.existsByName(roleRequestDto.getName())) {

            throw new ResourceAlreadyExistsException(
                    "Role name already exists"
            );
        }

        role.setName(roleRequestDto.getName());
        role.setDescription(roleRequestDto.getDescription());

        Role updatedRole = roleRepository.save(role);

        return modelMapper.map(updatedRole, RoleResponseDto.class);
    }
}