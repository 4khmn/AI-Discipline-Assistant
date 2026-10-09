DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'habit_recommendations' 
        AND column_name = 'has_error'
    ) THEN
        ALTER TABLE habit_recommendations ADD COLUMN has_error BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
END $$;
