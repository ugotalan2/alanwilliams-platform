package com.alanwilliams.platform.apps;

import com.alanwilliams.platform.person.Person;
import com.alanwilliams.platform.person.PersonService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PersonAppPreferenceService {

    private final PersonService personService;
    private final PersonAppPreferenceRepository preferenceRepository;
    private final AppCatalog appCatalog;

    public PersonAppPreferenceService(
            PersonService personService,
            PersonAppPreferenceRepository preferenceRepository,
            AppCatalog appCatalog
    ) {
        this.personService = personService;
        this.preferenceRepository = preferenceRepository;
        this.appCatalog = appCatalog;
    }

    @Transactional(readOnly = true)
    public List<PersonAppResponse> getAppSettings(
            String clerkUserId
    ) {
        Person person = personService.getByClerkUserId(clerkUserId);

        List<PersonAppPreference> preferences =
                preferenceRepository
                        .findByPersonOrderBySortOrderAscIdAsc(person);

        AppKey defaultApp = preferences.stream()
                .filter(PersonAppPreference::isDefaultApp)
                .map(PersonAppPreference::getAppKey)
                .findFirst()
                .orElse(AppKey.PLATFORM);

        List<PersonAppResponse> responses =
                new java.util.ArrayList<>();

        for (AppCatalogItem app : appCatalog.getApps()) {
            PersonAppPreference preference =
                    preferences.stream()
                            .filter(saved ->
                                    saved.getAppKey() == app.appKey()
                            )
                            .findFirst()
                            .orElse(null);

            boolean enabled =
                    preference != null && preference.isEnabled();

            int sortOrder =
                    preference != null
                            ? preference.getSortOrder()
                            : defaultSortOrder(app.appKey());

            responses.add(
                    new PersonAppResponse(
                            app.appKey(),
                            app.name(),
                            app.subdomain(),
                            app.status(),
                            enabled,
                            sortOrder,
                            app.appKey() == defaultApp
                    )
            );
        }

        return responses.stream()
                .sorted(
                        java.util.Comparator.comparingInt(
                                PersonAppResponse::sortOrder
                        )
                )
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PersonAppPreference> getPreferences(
            String clerkUserId
    ) {
        Person person = personService.getByClerkUserId(clerkUserId);

        return preferenceRepository
                .findByPersonOrderBySortOrderAscIdAsc(person);
    }

    @Transactional(readOnly = true)
    public AppKey getDefaultApp(
            String clerkUserId
    ) {
        Person person = personService.getByClerkUserId(clerkUserId);

        return preferenceRepository
                .findByPersonAndDefaultAppTrue(person)
                .map(PersonAppPreference::getAppKey)
                .orElse(AppKey.PLATFORM);
    }

    @Transactional
    public PersonAppPreference setEnabled(
            String clerkUserId,
            AppKey appKey,
            boolean enabled
    ) {
        Person person = personService.getByClerkUserId(clerkUserId);

        appCatalog.get(appKey);

        PersonAppPreference preference =
                getOrCreatePreference(person, appKey);

        preference.setEnabled(enabled);

        if (!enabled
                && preference.isDefaultApp()
                && appKey != AppKey.PLATFORM) {

            preferenceRepository.clearDefaultForPerson(person);
            makePlatformDefault(person);
        }

        return preferenceRepository.save(preference);
    }

    @Transactional
    public PersonAppPreference setDefaultApp(
            String clerkUserId,
            AppKey appKey
    ) {
        Person person = personService.getByClerkUserId(clerkUserId);

        AppCatalogItem catalogItem = appCatalog.get(appKey);

        if (catalogItem.status() != AppStatus.AVAILABLE) {
            throw new IllegalArgumentException(
                    "Default app must be available"
            );
        }

        PersonAppPreference target =
                getOrCreatePreference(person, appKey);

        if (appKey != AppKey.PLATFORM) {
            target.setEnabled(true);
        }

        preferenceRepository.clearDefaultForPerson(person);

        target.makeDefault();

        return preferenceRepository.save(target);
    }

    @Transactional
    public List<PersonAppPreference> reorder(
            String clerkUserId,
            List<AppKey> appKeys
    ) {
        Person person = personService.getByClerkUserId(clerkUserId);

        if (appKeys == null) {
            throw new IllegalArgumentException(
                    "App order must not be null"
            );
        }

        if (appKeys.size() != appKeys.stream().distinct().count()) {
            throw new IllegalArgumentException(
                    "App order must not contain duplicate apps"
            );
        }

        for (AppKey appKey : appKeys) {
            appCatalog.get(appKey);
        }

        for (int index = 0; index < appKeys.size(); index++) {
            AppKey appKey = appKeys.get(index);

            PersonAppPreference preference =
                    getOrCreatePreference(person, appKey);

            preference.setSortOrder(index);

            preferenceRepository.save(preference);
        }

        return preferenceRepository
                .findByPersonOrderBySortOrderAscIdAsc(person);
    }

    private PersonAppPreference getOrCreatePreference(
            Person person,
            AppKey appKey
    ) {
        return preferenceRepository
                .findByPersonAndAppKey(person, appKey)
                .orElseGet(() ->
                        PersonAppPreference.create(
                                person,
                                appKey,
                                false,
                                defaultSortOrder(appKey),
                                false
                        )
                );
    }

    private int defaultSortOrder(AppKey appKey) {
        List<AppCatalogItem> apps = appCatalog.getApps();

        for (int index = 0; index < apps.size(); index++) {
            if (apps.get(index).appKey() == appKey) {
                return index;
            }
        }

        throw new IllegalArgumentException(
                "Unknown app: " + appKey
        );
    }

    private void makePlatformDefault(Person person) {
        PersonAppPreference platform =
                getOrCreatePreference(
                        person,
                        AppKey.PLATFORM
                );

        platform.makeDefault();

        preferenceRepository.save(platform);
    }
}