-- Add admin user for authentication testing
INSERT INTO users (name, email, password) VALUES 
('Admin User', 'admin@example.com', 'admin123')
ON CONFLICT (email) DO NOTHING;