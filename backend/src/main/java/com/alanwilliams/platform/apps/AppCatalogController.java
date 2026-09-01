package com.alanwilliams.platform.apps;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/apps")
public class AppCatalogController {

    private final AppCatalogService appCatalogService;

    public AppCatalogController(
            AppCatalogService appCatalogService
    ) {
        this.appCatalogService = appCatalogService;
    }

    @GetMapping
    public List<AppCatalogResponse> getApps() {
        return appCatalogService.getApps();
    }
}