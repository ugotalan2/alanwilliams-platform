package com.alanwilliams.platform.apps;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AppCatalog {

    private static final List<AppCatalogItem> APPS = List.of(
            new AppCatalogItem(
                    AppKey.PLATFORM,
                    "AlanWilliams Apps",
                    "platform",
                    AppStatus.AVAILABLE
            ),
            new AppCatalogItem(
                    AppKey.AGENDA,
                    "Agenda",
                    "agenda",
                    AppStatus.AVAILABLE
            ),
            new AppCatalogItem(
                    AppKey.BUDGET,
                    "Budget",
                    "budget",
                    AppStatus.COMING_SOON
            ),
            new AppCatalogItem(
                    AppKey.CHORES,
                    "Chores",
                    "chores",
                    AppStatus.COMING_SOON
            ),
            new AppCatalogItem(
                    AppKey.FITNESS,
                    "Fitness",
                    "fitness",
                    AppStatus.COMING_SOON
            )
    );

    public List<AppCatalogItem> getApps() {
        return APPS;
    }

    public AppCatalogItem get(AppKey appKey) {
        return APPS.stream()
                .filter(app -> app.appKey() == appKey)
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Unknown app: " + appKey
                        )
                );
    }
}