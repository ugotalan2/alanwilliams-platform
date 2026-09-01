package com.alanwilliams.platform.apps;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AppKey {
    PLATFORM("platform"),
    AGENDA("agenda"),
    BUDGET("budget"),
    CHORES("chores"),
    FITNESS("fitness");

    private final String apiValue;

    AppKey(String apiValue) {
        this.apiValue = apiValue;
    }

    @JsonValue
    public String getApiValue() {
        return apiValue;
    }

    @JsonCreator
    public static AppKey fromApiValue(String value) {
        for (AppKey appKey : values()) {
            if (appKey.apiValue.equalsIgnoreCase(value)) {
                return appKey;
            }
        }

        throw new IllegalArgumentException(
                "Unknown app key: " + value
        );
    }
}