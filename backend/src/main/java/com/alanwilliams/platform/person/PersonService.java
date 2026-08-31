package com.alanwilliams.platform.person;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.time.DateTimeException;
import java.time.ZoneId;

@Service
public class PersonService {

    private final PersonRepository personRepository;

    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Transactional(readOnly = true)
    public Optional<Person> findByClerkUserId(String clerkUserId) {
        return personRepository.findByClerkUserId(clerkUserId);
    }

    @Transactional(readOnly = true)
    public Person getByClerkUserId(String clerkUserId) {
        return personRepository.findByClerkUserId(clerkUserId)
                .orElseThrow(PersonNotFoundException::new);
    }

    @Transactional
    public Person createAndLinkPerson(
            String clerkUserId,
            String name,
            String notificationEmail,
            String timeZone,
            AppearanceMode appearanceMode
    ) {
        validateNameRequired(name);
        validateTimeZone(timeZone);

        if (personRepository.existsByClerkUserId(clerkUserId)) {
            throw new PersonAlreadyLinkedException();
        }

        Person person = Person.createLinked(
                clerkUserId,
                name.trim(),
                normalizeEmail(notificationEmail),
                timeZone,
                appearanceMode
        );

        return personRepository.save(person);
    }

    @Transactional
    public Person updateProfile(
            String clerkUserId,
            String name,
            String notificationEmail,
            String timeZone,
            AppearanceMode appearanceMode
    ) {
        validateName(name);
        validateTimeZone(timeZone);

        Person person = getByClerkUserId(clerkUserId);

        person.updateProfile(
                name,
                notificationEmail,
                timeZone,
                appearanceMode
        );

        return person;
    }

    private void validateName(String name) {
        if (name != null && name.isBlank()) {
            throw new IllegalArgumentException("Name must not be blank");
        }
    }

    private void validateTimeZone(String timeZone) {
        if (timeZone == null) {
            return;
        }

        try {
            ZoneId.of(timeZone);
        } catch (DateTimeException ex) {
            throw new IllegalArgumentException("Invalid time zone: " + timeZone);
        }
    }

    private void validateNameRequired(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name must not be blank");
        }
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        return email.trim();
    }
}