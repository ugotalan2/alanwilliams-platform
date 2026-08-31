package com.alanwilliams.platform.account;

import com.alanwilliams.platform.person.AppearanceMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePersonRequest(

        @NotBlank
        @Size(max = 150)
        String name,

        @Size(max = 255)
        String notificationEmail,

        @Size(max = 100)
        String timeZone,

        AppearanceMode appearanceMode
) {
}