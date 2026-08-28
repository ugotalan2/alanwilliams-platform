package com.alanwilliams.platform.account;

import com.alanwilliams.security.ClerkPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MeController {

    @GetMapping("/me")
    public Map<String, String> me(
            @AuthenticationPrincipal ClerkPrincipal principal
    ) {
        return Map.of(
                "clerkUserId", principal.clerkUserId()
        );
    }
}