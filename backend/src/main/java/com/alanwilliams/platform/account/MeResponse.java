package com.alanwilliams.platform.account;

import com.alanwilliams.platform.person.AppearanceMode;
import com.alanwilliams.platform.person.PersonStatus;

public record MeResponse(
        Long id,
        String name,
        String notificationEmail,
        String timeZone,
        AppearanceMode appearanceMode,
        PersonStatus status
) {
}