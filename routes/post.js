const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { userId, username, avatar, content, imageUrl } = req.body;
    
    // Validate required fields
    if (!userId || !username || !avatar || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert post into Supabase
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: userId,
          username: username,
          avatar: avatar,
          content: content,
          image_url: imageUrl || null,
          created_at: new Date().toISOString(),
          likes: 0,
          comments: 0
        }
      ])
      .select();
    
    if (error) {
      throw error;
    }
    
    res.status(201).json({ 
      message: 'Post created successfully', 
      post: data[0] 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get posts with pagination and randomization
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    // Get total count of posts
    const { count, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw countError;
    }
    
    // Get posts with random ordering
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    if (error) {
      throw error;
    }
    
    res.json({ 
      posts: data, 
      totalCount: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ post: data });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, imageUrl } = req.body;
    
    const { data, error } = await supabase
      .from('posts')
      .update({ 
        content: content,
        image_url: imageUrl || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ 
      message: 'Post updated successfully', 
      post: data[0] 
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;