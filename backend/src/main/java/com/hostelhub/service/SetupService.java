package com.hostelhub.service;

import com.hostelhub.dto.Auth.AuthResponseDto;
import com.hostelhub.dto.Auth.SetupRequestDto;

public interface SetupService {

    AuthResponseDto initialize(SetupRequestDto requestDto);

    boolean isSetupRequired();
}