package com.hostelhub.service;

import com.hostelhub.dto.UserRequestDto;
import com.hostelhub.dto.UserResponseDto;

import java.util.List;

public interface UserService {

    UserResponseDto create(UserRequestDto userRequestDto);

    List<UserResponseDto> getAllUsers();

    UserResponseDto getUserById(Long id);

    UserResponseDto updateUser(Long id, UserRequestDto userRequestDto);

    void deleteUser(Long id);
}
