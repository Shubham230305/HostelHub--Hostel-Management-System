package com.hostelhub.serviceImpl;

import com.hostelhub.component.JwtTokenProvider;
import com.hostelhub.dto.Auth.AuthResponseDto;
import com.hostelhub.dto.Auth.SetupRequestDto;
import com.hostelhub.entity.Role;
import com.hostelhub.entity.User;
import com.hostelhub.exception.ResourceAlreadyExistsException;
import com.hostelhub.exception.ResourceNotFoundException;
import com.hostelhub.repository.RoleRepository;
import com.hostelhub.repository.UserRepository;
import com.hostelhub.service.SetupService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SetupServiceImplementation implements SetupService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional(readOnly = true)
    public boolean isSetupRequired() {
        return userRepository.count() == 0;
    }

    @Override
    @Transactional
    public AuthResponseDto initialize(SetupRequestDto requestDto) {

        // Setup is allowed only when the database has no users.
        if (userRepository.count() > 0) {
            throw new ResourceAlreadyExistsException(
                    "Initial setup has already been completed."
            );
        }

        // Extra email check for safety.
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new ResourceAlreadyExistsException(
                    "User already exists with email: " + requestDto.getEmail()
            );
        }

        // The first account is ALWAYS ADMIN.
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "ADMIN role not found. Please create the role first."
                        )
                );

        User user = User.builder()
                .name(requestDto.getName())
                .email(requestDto.getEmail())
                .mobile(requestDto.getMobile())
                .password(passwordEncoder.encode(requestDto.getPassword()))
                .address(requestDto.getAddress())
                .dateOfBirth(requestDto.getDateOfBirth())
                .role(adminRole)
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(
                savedUser.getEmail()
        );

        return buildAuthResponse(savedUser, token);
    }

    private AuthResponseDto buildAuthResponse(User user, String token) {

        AuthResponseDto responseDto = new AuthResponseDto();

        responseDto.setAccessToken(token);
        responseDto.setTokenType("Bearer");
        responseDto.setUserId(user.getId());
        responseDto.setName(user.getName());
        responseDto.setEmail(user.getEmail());
        responseDto.setRole(user.getRole().getName());

        return responseDto;
    }
}