package com.alanwilliams.platform.apps;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppCatalogService {

    private final AppCatalog appCatalog;

    public AppCatalogService(AppCatalog appCatalog) {
        this.appCatalog = appCatalog;
    }

    public List<AppCatalogResponse> getApps() {
        return appCatalog.getApps()
                .stream()
                .map(app -> new AppCatalogResponse(
                        app.appKey(),
                        app.name(),
                        app.subdomain(),
                        app.status()
                ))
                .toList();
    }
}