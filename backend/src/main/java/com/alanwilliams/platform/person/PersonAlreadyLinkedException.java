package com.alanwilliams.platform.person;

public class PersonAlreadyLinkedException extends RuntimeException {

    public PersonAlreadyLinkedException() {
        super("The authenticated account is already linked to a Platform Person.");
    }
}