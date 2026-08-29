package com.alanwilliams.platform.account;

import com.alanwilliams.platform.person.PersonNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(PersonNotFoundException.class)
    public ResponseEntity<Map<String, String>> handlePersonNotFound(
            PersonNotFoundException ex
    ) {
        return ResponseEntity.status(404).body(
                Map.of("error", ex.getMessage())
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(
            IllegalArgumentException ex
    ) {
        return ResponseEntity.badRequest().body(
                Map.of("error", ex.getMessage())
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(
            MethodArgumentNotValidException ex
    ) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Invalid request");

        return ResponseEntity.badRequest().body(
                Map.of("error", message)
        );
    }
}