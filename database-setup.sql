-- Faith Recall - Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient leaderboard queries
CREATE INDEX IF NOT EXISTS idx_players_score ON players(score DESC);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read (for leaderboard)
CREATE POLICY "Allow public read access" ON players
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert (for saving scores)
CREATE POLICY "Allow public insert access" ON players
  FOR INSERT
  WITH CHECK (true);

-- Optional: Create policy to allow delete (for admin reset)
-- Note: In production, you may want to restrict this to authenticated admin users
CREATE POLICY "Allow public delete access" ON players
  FOR DELETE
  USING (true);

