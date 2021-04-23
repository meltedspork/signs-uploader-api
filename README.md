
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO Users(uid, id_provider_user_id, email, created_at, updated_at) VALUES (uuid_generate_v4(), 'id_provider_user_id', 'email@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);