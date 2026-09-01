package com.alanwilliams.platform.apps;

public record AppCatalogItem(
        AppKey appKey,
        String name,
        String subdomain,
        AppStatus status
) {
}