const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create posts table
async function createPostsTable() {
  try {
    const { error } = await supabase.rpc('create_posts_table');
    
    if (error) {
      // If RPC doesn't exist, create table with SQL
      const { error: sqlError } = await supabase.rpc('execute_sql', {
        sql: `
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
          
          CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at);
        `
      });
      
      if (sqlError) {
        throw sqlError;
      }
    }
    
    console.log('Posts table created successfully');
  } catch (error) {
    console.error('Error creating posts table:', error);
  }
}

// Function to create likes table
async function createLikesTable() {
  try {
    const { error } = await supabase.rpc('create_likes_table');
    
    if (error) {
      // If RPC doesn't exist, create table with SQL
      const { error: sqlError } = await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS likes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(post_id, user_id)
          );
          
          CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes (post_id);
        `
      });
      
      if (sqlError) {
        throw sqlError;
      }
    }
    
    console.log('Likes table created successfully');
  } catch (error) {
    console.error('Error creating likes table:', error);
  }
}

// Function to create comments table
async function createCommentsTable() {
  try {
    const { error } = await supabase.rpc('create_comments_table');
    
    if (error) {
      // If RPC doesn't exist, create table with SQL
      const { error: sqlError } = await supabase.rpc('execute_sql', {
        sql: `
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
          
          CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);
          CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (created_at);
        `
      });
      
      if (sqlError) {
        throw sqlError;
      }
    }
    
    console.log('Comments table created successfully');
  } catch (error) {
    console.error('Error creating comments table:', error);
  }
}

// Function to create comment_likes table
async function createCommentLikesTable() {
  try {
    const { error } = await supabase.rpc('create_comment_likes_table');
    
    if (error) {
      // If RPC doesn't exist, create table with SQL
      const { error: sqlError } = await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS comment_likes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(comment_id, user_id)
          );
          
          CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes (comment_id);
        `
      });
      
      if (sqlError) {
        throw sqlError;
      }
    }
    
    console.log('Comment likes table created successfully');
  } catch (error) {
    console.error('Error creating comment likes table:', error);
  }
}

// Initialize all tables
async function initTables() {
  console.log('Initializing database tables...');
  
  await createPostsTable();
  await createLikesTable();
  await createCommentsTable();
  await createCommentLikesTable();
  
  console.log('All tables initialized successfully');
}

// Run initialization
initTables();