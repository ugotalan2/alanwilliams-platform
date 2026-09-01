package com.alanwilliams.platform.apps;

import java.util.List;

public record ReorderAppsRequest(
        List<AppKey> appKeys
) {
}