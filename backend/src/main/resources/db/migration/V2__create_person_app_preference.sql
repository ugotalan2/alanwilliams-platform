CREATE TABLE person_app_preference (
   id BIGSERIAL PRIMARY KEY,
   person_id BIGINT NOT NULL,
   app_key VARCHAR(50) NOT NULL,
   enabled BOOLEAN NOT NULL DEFAULT FALSE,
   sort_order INTEGER NOT NULL DEFAULT 0,
   is_default BOOLEAN NOT NULL DEFAULT FALSE,
   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

   CONSTRAINT fk_person_app_preference_person
       FOREIGN KEY (person_id)
           REFERENCES person(id)
           ON DELETE CASCADE,

   CONSTRAINT uq_person_app_preference_person_app
       UNIQUE (person_id, app_key),

   CONSTRAINT ck_person_app_preference_sort_order
       CHECK (sort_order >= 0)
);

CREATE UNIQUE INDEX uq_person_app_preference_default
    ON person_app_preference (person_id)
    WHERE is_default = TRUE;