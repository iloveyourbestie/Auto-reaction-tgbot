CREATE TABLE IF NOT EXISTS users(
 telegram_id BIGINT PRIMARY KEY,
 plan TEXT DEFAULT 'free',
 credits INT DEFAULT 0,
 plan_expires TIMESTAMP
);
CREATE TABLE IF NOT EXISTS projects(
 id SERIAL PRIMARY KEY,
 telegram_id BIGINT,
 channel_id BIGINT,
 reactions INT,
 delay INT,
 active BOOLEAN DEFAULT true
);
CREATE TABLE IF NOT EXISTS license_keys(
 id SERIAL PRIMARY KEY,
 key TEXT UNIQUE,
 credits INT,
 expires_at TIMESTAMP,
 used BOOLEAN DEFAULT false,
 used_by BIGINT
);