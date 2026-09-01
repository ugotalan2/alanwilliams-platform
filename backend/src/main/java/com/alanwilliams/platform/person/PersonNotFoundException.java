package com.alanwilliams.platform.person;

public class PersonNotFoundException extends RuntimeException {

    public PersonNotFoundException() {
        super("No Platform Person is linked to the authenticated account.");
    }
}