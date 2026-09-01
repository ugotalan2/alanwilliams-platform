package com.alanwilliams.platform.error;

public record ApiError(
        String code,
        String message
) {
}