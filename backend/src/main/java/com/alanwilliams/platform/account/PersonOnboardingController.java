package com.alanwilliams.platform.account;

import com.alanwilliams.platform.clerk.ClerkIdentityService;
import com.alanwilliams.platform.person.Person;
import com.alanwilliams.platform.person.PersonService;
import com.alanwilliams.security.ClerkPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PersonOnboardingController {

    private final PersonService personService;
    private final ClerkIdentityService clerkIdentityService;

    public PersonOnboardingController(
            PersonService personService,
            ClerkIdentityService clerkIdentityService
    ) {
        this.personService = personService;
        this.clerkIdentityService = clerkIdentityService;
    }

    @PostMapping("/onboarding/create")
    public ResponseEntity<MeResponse> create(
            @AuthenticationPrincipal ClerkPrincipal principal,
            @Valid @RequestBody CreatePersonRequest request
    ) {
        Person person = personService.createAndLinkPerson(
                principal.clerkUserId(),
                request.name(),
                request.notificationEmail(),
                request.timeZone(),
                request.appearanceMode()
        );

        clerkIdentityService.syncPlatformPersonId(
                principal.clerkUserId(),
                person.getId()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(person));
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