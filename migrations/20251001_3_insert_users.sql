INSERT INTO users (name, email, password) VALUES
('Testuser1', 'testuser1@mail.com', '$2b$10$FMtzZtIAc/odbhNkWVzCjOnN7daXy/2h36hh/kBk1xpdIDUYLsJeK')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, password) VALUES
('Testuser2', 'testuser2@mail.com', '$2b$10$o0T6a6ve/AMQG9L.ekaAfOgLvWqU/TTzv5VD/zQb.mXl7wUP2JFOK')
ON CONFLICT (email) DO NOTHING;
