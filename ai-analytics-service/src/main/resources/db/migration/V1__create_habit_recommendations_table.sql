CREATE TABLE IF NOT EXISTS habit_recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    habit_id BIGINT,
    user_input TEXT NOT NULL,
    recommendation_text TEXT NOT NULL,
    ai_response_duration_ms BIGINT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
