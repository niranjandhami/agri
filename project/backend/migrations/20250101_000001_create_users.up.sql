CREATE EXTENSION IF NOT EXISTS "pgrandom";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
