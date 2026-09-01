package com.alanwilliams.platform.apps;

public record AppCatalogResponse(
        AppKey appKey,
        String name,
        String subdomain,
        AppStatus status
) {
}