[![CircleCI](https://app.circleci.com/github/meltedspork/signs-uploader-api.svg?style=svg)](https://app.circleci.com/pipelines/github/meltedspork/signs-uploader-api)


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO Users(uid, id_provider_user_id, email, created_at, updated_at) VALUES (uuid_generate_v4(), 'id_provider_user_id', 'email@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

