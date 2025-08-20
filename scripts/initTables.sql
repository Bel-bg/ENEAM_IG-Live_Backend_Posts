-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0
);

-- Create index on posts created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create index on likes post_id for faster queries
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes (post_id);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  likes INTEGER DEFAULT 0
);

-- Create indexes on comments for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (created_at);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create index on comment_likes comment_id for faster queries
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes (comment_id);