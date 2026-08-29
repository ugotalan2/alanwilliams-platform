CREATE TABLE person (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    notification_email VARCHAR(255),
    time_zone VARCHAR(100),
    appearance_mode VARCHAR(20) NOT NULL DEFAULT 'SYSTEM',
    clerk_user_id VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    merged_into_person_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_person_clerk_user_id
        UNIQUE (clerk_user_id),

    CONSTRAINT ck_person_appearance_mode
        CHECK (appearance_mode IN ('SYSTEM', 'LIGHT', 'DARK')),

    CONSTRAINT ck_person_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'MERGED')),

    CONSTRAINT ck_person_not_self_merged
        CHECK (merged_into_person_id IS NULL OR merged_into_person_id <> id),

    CONSTRAINT ck_person_merge_state
        CHECK (
            (status = 'MERGED' AND merged_into_person_id IS NOT NULL)
            OR
            (status <> 'MERGED' AND merged_into_person_id IS NULL)
        ),

    CONSTRAINT fk_person_merged_into
        FOREIGN KEY (merged_into_person_id)
        REFERENCES person(id)
);
