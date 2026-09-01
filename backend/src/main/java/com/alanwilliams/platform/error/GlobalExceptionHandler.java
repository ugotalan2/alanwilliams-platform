package com.alanwilliams.platform.error;

import com.alanwilliams.platform.person.PersonAlreadyLinkedException;
import com.alanwilliams.platform.person.PersonNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PersonNotFoundException.class)
    public ResponseEntity<ApiError> handlePersonNotFound(
            PersonNotFoundException exception
    ) {
        ApiError error = new ApiError(
                "PERSON_NOT_LINKED",
                "No Platform Person is linked to this authenticated account."
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(error);
    }

    @ExceptionHandler(PersonAlreadyLinkedException.class)
    public ResponseEntity<ApiError> handlePersonAlreadyLinked(
            PersonAlreadyLinkedException exception
    ) {
        ApiError error = new ApiError(
                "PERSON_ALREADY_LINKED",
                "This authenticated account is already linked to a Platform Person."
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(error);
    }
}