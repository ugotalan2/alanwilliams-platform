package com.alanwilliams.platform.apps;

import com.alanwilliams.platform.person.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PersonAppPreferenceRepository
        extends JpaRepository<PersonAppPreference, Long> {

    List<PersonAppPreference> findByPersonOrderBySortOrderAscIdAsc(
            Person person
    );

    Optional<PersonAppPreference> findByPersonAndAppKey(
            Person person,
            AppKey appKey
    );

    Optional<PersonAppPreference> findByPersonAndDefaultAppTrue(
            Person person
    );

    @Modifying(flushAutomatically = true)
    @Query("""
            update PersonAppPreference preference
            set preference.defaultApp = false
            where preference.person = :person
              and preference.defaultApp = true
            """)
    void clearDefaultForPerson(Person person);
}