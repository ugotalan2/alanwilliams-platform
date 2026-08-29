package com.alanwilliams.platform.account;

import com.alanwilliams.platform.person.AppearanceMode;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateMeRequest(

        @Size(min = 1, max = 150)
        String name,

        @Email
        @Size(max = 255)
        String notificationEmail,

        @Size(max = 100)
        String timeZone,

        AppearanceMode appearanceMode
) {
}