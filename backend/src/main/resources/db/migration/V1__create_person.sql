CREATE TABLE person (
                        id BIGSERIAL PRIMARY KEY,
                        name VARCHAR(150) NOT NULL,
                        notification_email VARCHAR(255),
                        appearance_mode VARCHAR(20) NOT NULL DEFAULT 'SYSTEM',
                        clerk_user_id VARCHAR(255) UNIQUE,
                        status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
                        merged_into_person_id BIGINT,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                        CONSTRAINT fk_person_merged_into
                            FOREIGN KEY (merged_into_person_id)
                                REFERENCES person(id)
);