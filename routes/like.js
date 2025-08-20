const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Like a post
router.post('/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Check if user already liked the post
    const { data: existingLike, error: likeError } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
    
    if (likeError && likeError.code !== 'PGRST116') {
      throw likeError;
    }
    
    if (existingLike) {
      return res.status(400).json({ error: 'Post already liked by user' });
    }
    
    // Add like to database
    const { data: likeData, error: insertError } = await supabase
      .from('likes')
      .insert([
        {
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (insertError) {
      throw insertError;
    }
    
    // Update post likes count
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', postId)
      .single();
    
    if (postError) {
      throw postError;
    }
    
    const { error: updateError } = await supabase
      .from('posts')
      .update({ likes: postData.likes + 1 })
      .eq('id', postId);
    
    if (updateError) {
      throw updateError;
    }
    
    res.status(201).json({ 
      message: 'Post liked successfully', 
      like: likeData[0] 
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unlike a post
router.delete('/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Find the like record
    const { data: likeData, error: selectError } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
    
    if (selectError) {
      if (selectError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Like not found' });
      }
      throw selectError;
    }
    
    // Delete like from database
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('id', likeData.id);
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Update post likes count
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', postId)
      .single();
    
    if (postError) {
      throw postError;
    }
    
    const { error: updateError } = await supabase
      .from('posts')
      .update({ likes: Math.max(0, postData.likes - 1) })
      .eq('id', postId);
    
    if (updateError) {
      throw updateError;
    }
    
    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;