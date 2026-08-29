package com.alanwilliams.platform.account;

import com.alanwilliams.platform.person.Person;
import com.alanwilliams.platform.person.PersonService;
import com.alanwilliams.security.ClerkPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
public class MeController {

    private final PersonService personService;

    public MeController(PersonService personService) {
        this.personService = personService;
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