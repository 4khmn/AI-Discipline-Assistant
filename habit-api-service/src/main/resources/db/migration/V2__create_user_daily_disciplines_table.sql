CREATE TABLE user_daily_disciplines (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    discipline_date DATE NOT NULL,
    water_2l BOOLEAN NOT NULL DEFAULT FALSE,
    workout BOOLEAN NOT NULL DEFAULT FALSE,
    running BOOLEAN NOT NULL DEFAULT FALSE,
    steps_10k BOOLEAN NOT NULL DEFAULT FALSE,
    outdoor_walk BOOLEAN NOT NULL DEFAULT FALSE,
    leetcode BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_date UNIQUE (user_id, discipline_date)
);

CREATE INDEX idx_user_daily_disciplines_user_date ON user_daily_disciplines(user_id, discipline_date DESC);
