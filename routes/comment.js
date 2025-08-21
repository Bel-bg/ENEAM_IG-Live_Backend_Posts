const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Add a comment to a post
router.post('/:postId/comment', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, username, avatar, text } = req.body;
    
    // Validate required fields
    if (!userId || !username || !avatar || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert comment into Supabase
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: postId,
          user_id: userId,
          username: username,
          avatar: avatar,
          text: text,
          created_at: new Date().toISOString(),
          likes: 0
        }
      ])
      .select();
    
    if (error) {
      throw error;
    }
    
    // Update post comments count
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select('comments')
      .eq('id', postId)
      .single();
    
    if (postError) {
      throw postError;
    }
    
    const { error: updateError } = await supabase
      .from('posts')
      .update({ comments: postData.comments + 1 })
      .eq('id', postId);
    
    if (updateError) {
      throw updateError;
    }
    
    res.status(201).json({ 
      message: 'Comment added successfully', 
      comment: data[0] 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comments for a post
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    res.json({ comments: data });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Like a comment
router.post('/comment/:commentId/like', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    // Check if user already liked the comment
    const { data: existingLike, error: likeError } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();
    
    if (likeError && likeError.code !== 'PGRST116') {
      throw likeError;
    }
    
    if (existingLike) {
      return res.status(400).json({ error: 'Comment already liked by user' });
    }
    
    // Add like to database
    const { data: likeData, error: insertError } = await supabase
      .from('comment_likes')
      .insert([
        {
          comment_id: commentId,
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (insertError) {
      throw insertError;
    }
    
    // Update comment likes count
    const { data: commentData, error: commentError } = await supabase
      .from('comments')
      .select('likes')
      .eq('id', commentId)
      .single();
    
    if (commentError) {
      throw commentError;
    }
    
    const { error: updateError } = await supabase
      .from('comments')
      .update({ likes: commentData.likes + 1 })
      .eq('id', commentId);
    
    if (updateError) {
      throw updateError;
    }
    
    res.status(201).json({ 
      message: 'Comment liked successfully', 
      like: likeData[0] 
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unlike a comment
router.delete('/comment/:commentId/like', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Find the like record
    const { data: likeData, error: selectError } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
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
      .from('comment_likes')
      .delete()
      .eq('id', likeData.id);
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Update comment likes count
    const { data: commentData, error: commentError } = await supabase
      .from('comments')
      .select('likes')
      .eq('id', commentId)
      .single();
    
    if (commentError) {
      throw commentError;
    }
    
    const { error: updateError } = await supabase
      .from('comments')
      .update({ likes: Math.max(0, commentData.likes - 1) })
      .eq('id', commentId);
    
    if (updateError) {
      throw updateError;
    }
    
    res.json({ message: 'Comment unliked successfully' });
  } catch (error) {
    console.error('Error unliking comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;