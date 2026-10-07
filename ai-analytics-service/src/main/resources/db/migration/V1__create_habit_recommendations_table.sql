CREATE TABLE IF NOT EXISTS habit_recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    report_text TEXT,
    recommendation TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE
);
