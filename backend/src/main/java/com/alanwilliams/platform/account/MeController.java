package com.alanwilliams.platform.account;

import com.alanwilliams.platform.person.Person;
import com.alanwilliams.platform.person.PersonService;
import com.alanwilliams.security.ClerkPrincipal;
import com.alanwilliams.platform.clerk.ClerkIdentityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
public class MeController {

    private final PersonService personService;
    private final ClerkIdentityService clerkIdentityService;

    public MeController(PersonService personService, ClerkIdentityService clerkIdentityService) {
        this.personService = personService;
        this.clerkIdentityService = clerkIdentityService;
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(
            @AuthenticationPrincipal ClerkPrincipal principal
    ) {
        Person person = personService.getByClerkUserId(
                principal.clerkUserId()
        );

        return ResponseEntity.ok(toResponse(person));
    }

    @PatchMapping("/me")
    public ResponseEntity<MeResponse> updateMe(
            @AuthenticationPrincipal ClerkPrincipal principal,
            @Valid @RequestBody UpdateMeRequest request
    ) {
        Person person = personService.updateProfile(
                principal.clerkUserId(),
                request.name(),
                request.notificationEmail(),
                request.timeZone(),
                request.appearanceMode()
        );

        return ResponseEntity.ok(toResponse(person));
    }

    @PostMapping("/me/sync-identity")
    public ResponseEntity<Void> syncIdentity(
            @AuthenticationPrincipal ClerkPrincipal principal
    ) {
        Person person = personService.getByClerkUserId(
                principal.clerkUserId()
        );

        clerkIdentityService.syncPlatformPersonId(
                principal.clerkUserId(),
                person.getId()
        );

        return ResponseEntity.noContent().build();
    }

    private MeResponse toResponse(Person person) {
        return new MeResponse(
                person.getId(),
                person.getName(),
                person.getNotificationEmail(),
                person.getTimeZone(),
                person.getAppearanceMode(),
                person.getStatus()
        );
    }
}