package com.alanwilliams.platform.person;

public class PersonNotFoundException extends RuntimeException {

    public PersonNotFoundException(String clerkUserId) {
        super("No Person linked to Clerk user: " + clerkUserId);
    }
}