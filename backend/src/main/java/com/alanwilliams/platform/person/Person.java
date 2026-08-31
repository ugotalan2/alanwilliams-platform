package com.alanwilliams.platform.person;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Entity
@Table(name = "person")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "notification_email", length = 255)
    private String notificationEmail;

    @Column(name = "time_zone", length = 100)
    private String timeZone;

    @Enumerated(EnumType.STRING)
    @Column(name = "appearance_mode", nullable = false, length = 20)
    private AppearanceMode appearanceMode = AppearanceMode.SYSTEM;

    @Column(name = "clerk_user_id", length = 255, unique = true)
    private String clerkUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PersonStatus status = PersonStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merged_into_person_id")
    private Person mergedIntoPerson;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    protected Person() {
    }

    public Person(String name) {
        this.name = name;
    }

    public static Person createLinked(
            String clerkUserId,
            String name,
            String notificationEmail,
            String timeZone,
            AppearanceMode appearanceMode
    ) {
        Person person = new Person();

        person.clerkUserId = clerkUserId;
        person.name = name;
        person.notificationEmail = notificationEmail;
        person.timeZone = timeZone;
        person.appearanceMode = appearanceMode != null ? appearanceMode : AppearanceMode.SYSTEM;
        person.status = PersonStatus.ACTIVE;

        return person;
    }

    public void updateProfile(
            String name,
            String notificationEmail,
            String timeZone,
            AppearanceMode appearanceMode
    ) {
        if (name != null) {
            this.name = name;
        }

        if (notificationEmail != null) {
            this.notificationEmail = notificationEmail;
        }

        if (timeZone != null) {
            this.timeZone = timeZone;
        }

        if (appearanceMode != null) {
            this.appearanceMode = appearanceMode;
        }
    }
}