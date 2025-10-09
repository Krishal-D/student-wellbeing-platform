-- Insert some test messages for the test users

INSERT INTO message (to_user_id, from_user_id, message_text) VALUES
(1, 2, 'Hello Testuser1.'),
(2, 1, 'Hello Testuser2.');