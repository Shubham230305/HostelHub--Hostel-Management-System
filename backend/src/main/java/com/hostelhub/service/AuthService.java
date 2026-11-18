package com.hostelhub.service;

import com.hostelhub.dto.Auth.AuthResponseDto;
import com.hostelhub.dto.Auth.LoginRequestDto;
import com.hostelhub.dto.Auth.RegisterRequestDto;

public interface AuthService {

    AuthResponseDto register(RegisterRequestDto requestDto);

    AuthResponseDto login(LoginRequestDto requestDto);
}