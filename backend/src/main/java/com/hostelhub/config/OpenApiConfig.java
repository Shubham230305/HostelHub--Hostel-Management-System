package com.hostelhub.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        final String schemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("HostelHub API")
                        .version("1.0")
                        .description(
                                "REST APIs for HostelHub - Hostel Management System. " +
                                        "Manage users, roles, hostels, rooms, allocations, " +
                                        "maintenance requests, and dashboards."
                        )
                        .contact(new Contact()
                                .name("HostelHub Development Team")
                        )
                )
                .components(new Components()
                        .addSecuritySchemes(
                                schemeName,
                                new SecurityScheme()
                                        .name(schemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )
                );
    }
}
