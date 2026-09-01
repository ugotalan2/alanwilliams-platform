package com.alanwilliams.platform.apps;

import com.alanwilliams.security.ClerkPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/account/apps")
public class PersonAppsController {

    private final PersonAppPreferenceService preferenceService;

    public PersonAppsController(
            PersonAppPreferenceService preferenceService
    ) {
        this.preferenceService = preferenceService;
    }

    @GetMapping
    public ResponseEntity<List<PersonAppResponse>> getApps(
            @AuthenticationPrincipal ClerkPrincipal principal
    ) {
        return ResponseEntity.ok(
                preferenceService.getAppSettings(
                        principal.clerkUserId()
                )
        );
    }

    @PatchMapping("/{appKey}/enabled")
    public ResponseEntity<List<PersonAppResponse>> setEnabled(
            @AuthenticationPrincipal ClerkPrincipal principal,
            @PathVariable String appKey,
            @RequestBody SetAppEnabledRequest request
    ) {
        preferenceService.setEnabled(
                principal.clerkUserId(),
                AppKey.fromApiValue(appKey),
                request.enabled()
        );

        return ResponseEntity.ok(
                preferenceService.getAppSettings(
                        principal.clerkUserId()
                )
        );
    }

    @PatchMapping("/{appKey}/default")
    public ResponseEntity<List<PersonAppResponse>> setDefault(
            @AuthenticationPrincipal ClerkPrincipal principal,
            @PathVariable String appKey
    ) {
        preferenceService.setDefaultApp(
                principal.clerkUserId(),
                AppKey.fromApiValue(appKey)
        );

        return ResponseEntity.ok(
                preferenceService.getAppSettings(
                        principal.clerkUserId()
                )
        );
    }

    @PatchMapping("/order")
    public ResponseEntity<List<PersonAppResponse>> reorder(
            @AuthenticationPrincipal ClerkPrincipal principal,
            @RequestBody ReorderAppsRequest request
    ) {
        preferenceService.reorder(
                principal.clerkUserId(),
                request.appKeys()
        );

        return ResponseEntity.ok(
                preferenceService.getAppSettings(
                        principal.clerkUserId()
                )
        );
    }
}