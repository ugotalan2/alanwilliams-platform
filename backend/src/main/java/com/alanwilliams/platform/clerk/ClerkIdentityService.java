package com.alanwilliams.platform.clerk;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class ClerkIdentityService {

    private final RestClient restClient;

    public ClerkIdentityService(
            @Value("${clerk.secret-key}") String clerkSecretKey
    ) {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.clerk.com/v1")
                .defaultHeader(
                        "Authorization",
                        "Bearer " + clerkSecretKey
                )
                .build();
    }

    public void syncPlatformPersonId(
            String clerkUserId,
            Long platformPersonId
    ) {
        restClient.patch()
                .uri("/users/{userId}/metadata", clerkUserId)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "public_metadata",
                        Map.of(
                                "platform_person_id",
                                platformPersonId
                        )
                ))
                .retrieve()
                .toBodilessEntity();
    }
}