-- password1 / password2 hashed with bcrypt 10 rounds
INSERT INTO users (name, email, password) VALUES
('Testuser1', 'testuser1@mail.com', '$2b$10$ZLIRub9pOb/mRXT.J9RjqOSjJ2XIFkcZTKi7bQp3g2BIpH/XnrCIq')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, password) VALUES
('Testuser2', 'testuser2@mail.com', '$2b$10$Gf.fYRYgemfmO5Sei3gqy.li/BnCEPvQ4cxAB4wOKSaRnmScF3UXy')
ON CONFLICT (email) DO NOTHING;
