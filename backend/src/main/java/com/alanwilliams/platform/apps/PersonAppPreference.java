package com.alanwilliams.platform.apps;

import com.alanwilliams.platform.person.Person;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Entity
@Table(
        name = "person_app_preference",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_person_app_preference_person_app",
                        columnNames = {"person_id", "app_key"}
                )
        }
)
public class PersonAppPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Enumerated(EnumType.STRING)
    @Column(name = "app_key", nullable = false, length = 50)
    private AppKey appKey;

    @Column(nullable = false)
    private boolean enabled;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "is_default", nullable = false)
    private boolean defaultApp;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected PersonAppPreference() {
    }

    private PersonAppPreference(
            Person person,
            AppKey appKey,
            boolean enabled,
            int sortOrder,
            boolean defaultApp
    ) {
        this.person = person;
        this.appKey = appKey;
        this.enabled = enabled;
        this.sortOrder = sortOrder;
        this.defaultApp = defaultApp;
    }

    public static PersonAppPreference create(
            Person person,
            AppKey appKey,
            boolean enabled,
            int sortOrder,
            boolean defaultApp
    ) {
        return new PersonAppPreference(
                person,
                appKey,
                enabled,
                sortOrder,
                defaultApp
        );
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setSortOrder(int sortOrder) {
        if (sortOrder < 0) {
            throw new IllegalArgumentException("Sort order must not be negative");
        }

        this.sortOrder = sortOrder;
    }

    public void makeDefault() {
        this.defaultApp = true;
    }

    public void clearDefault() {
        this.defaultApp = false;
    }

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
}