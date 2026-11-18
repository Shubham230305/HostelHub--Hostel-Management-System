
package com.hostelhub.serviceImpl;

import com.hostelhub.component.JwtTokenProvider;
import com.hostelhub.dto.Auth.AuthResponseDto;
import com.hostelhub.dto.Auth.LoginRequestDto;
import com.hostelhub.dto.Auth.RegisterRequestDto;
import com.hostelhub.entity.Role;
import com.hostelhub.entity.User;
import com.hostelhub.exception.ResourceAlreadyExistsException;
import com.hostelhub.exception.ResourceNotFoundException;
import com.hostelhub.repository.RoleRepository;
import com.hostelhub.repository.UserRepository;
import com.hostelhub.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthServiceImplementation implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponseDto register(RegisterRequestDto requestDto) {

        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new ResourceAlreadyExistsException(
                    "User already exists with email: " + requestDto.getEmail()
            );
        }

        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "STUDENT role not found. Please create the role first."
                        )
                );

        User user = User.builder()
                .name(requestDto.getName())
                .email(requestDto.getEmail())
                .mobile(requestDto.getMobile())
                .password(passwordEncoder.encode(requestDto.getPassword()))
                .address(requestDto.getAddress())
                .dateOfBirth(requestDto.getDateOfBirth())
                .role(studentRole)
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(
                savedUser.getEmail()
        );

        return buildAuthResponse(savedUser, token);
    }

    @Override
    public AuthResponseDto login(LoginRequestDto requestDto) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            requestDto.getEmail(),
                            requestDto.getPassword()
                    )
            );

        } catch (AuthenticationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        User user = userRepository.findByEmailWithRole(
                        requestDto.getEmail()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        String token = jwtTokenProvider.generateToken(
                user.getEmail()
        );

        return buildAuthResponse(user, token);
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
