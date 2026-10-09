ALTER TABLE habit_recommendations 
    ADD COLUMN IF NOT EXISTS has_error BOOLEAN;

UPDATE habit_recommendations 
    SET has_error = FALSE 
    WHERE has_error IS NULL;

ALTER TABLE habit_recommendations 
    ALTER COLUMN has_error SET NOT NULL,
    ALTER COLUMN has_error SET DEFAULT FALSE;
