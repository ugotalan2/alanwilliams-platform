package com.alanwilliams.platform.apps;

public record PersonAppResponse(
        AppKey appKey,
        String name,
        String subdomain,
        AppStatus status,
        boolean enabled,
        int sortOrder,
        boolean defaultApp
) {
}