package com.hostelhub.serviceImpl;

import com.hostelhub.dto.UserRequestDto;
import com.hostelhub.dto.UserResponseDto;
import com.hostelhub.entity.Role;
import com.hostelhub.entity.User;
import com.hostelhub.exception.ResourceAlreadyExistsException;
import com.hostelhub.exception.ResourceNotFoundException;
import com.hostelhub.repository.RoleRepository;
import com.hostelhub.repository.UserRepository;
import com.hostelhub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDto create(UserRequestDto userRequestDto) {

        if (userRepository.existsByEmail(userRequestDto.getEmail())) {
            throw new ResourceAlreadyExistsException(
                    "Email already exists"
            );
        }

        Role role = roleRepository.findById(userRequestDto.getRoleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found with id: "
                                        + userRequestDto.getRoleId()
                        ));

        User user = new User();

        user.setName(userRequestDto.getName());
        user.setEmail(userRequestDto.getEmail());
        user.setMobile(userRequestDto.getMobile());

        user.setPassword(
                passwordEncoder.encode(userRequestDto.getPassword())
        );

        user.setAddress(userRequestDto.getAddress());
        user.setDateOfBirth(userRequestDto.getDateOfBirth());
        user.setRole(role);

        System.out.println("New User ID before save: " + user.getId());

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        ));

        return convertToResponse(user);
    }

    @Override
    public UserResponseDto updateUser(
            Long id,
            UserRequestDto userRequestDto) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        ));

        if (!user.getEmail().equals(userRequestDto.getEmail())
                && userRepository.existsByEmail(userRequestDto.getEmail())) {

            throw new ResourceAlreadyExistsException(
                    "Email already exists"
            );
        }

        Role role = roleRepository.findById(userRequestDto.getRoleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found with id: "
                                        + userRequestDto.getRoleId()
                        ));

        user.setName(userRequestDto.getName());
        user.setEmail(userRequestDto.getEmail());
        user.setMobile(userRequestDto.getMobile());

        user.setPassword(
                passwordEncoder.encode(userRequestDto.getPassword())
        );

        user.setAddress(userRequestDto.getAddress());
        user.setDateOfBirth(userRequestDto.getDateOfBirth());
        user.setRole(role);

        User updatedUser = userRepository.save(user);

        return convertToResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        ));

        userRepository.delete(user);
    }

    private UserResponseDto convertToResponse(User user) {

        UserResponseDto responseDto =
                modelMapper.map(user, UserResponseDto.class);

        responseDto.setRole(user.getRole().getName());

        return responseDto;
    }
}