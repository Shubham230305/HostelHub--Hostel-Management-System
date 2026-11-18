package com.hostelhub.config;

import com.hostelhub.entity.Role;
import com.hostelhub.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public void run(String... args) {

        createRole("ADMIN", "Hostel Administrator or Warden");
        createRole("STUDENT", "Hostel Student");
        createRole("MAINTENANCE", "Maintenance Staff Member");
    }

    private void createRole(String name, String description) {

        if (!roleRepository.existsByName(name)) {

            Role role = Role.builder()
                    .name(name)
                    .description(description)
                    .build();

            roleRepository.save(role);
        }
    }
}