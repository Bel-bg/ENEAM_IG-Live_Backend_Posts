const cron = require('node-cron');
const supabase = require('../config/supabase');

// Function to delete posts older than 2 weeks
const deleteOldPosts = async () => {
  try {
    console.log('Running cleanup job: Deleting posts older than 2 weeks');
    
    // Calculate the date 2 weeks ago
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    // Delete old posts
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .lt('created_at', twoWeeksAgo.toISOString());
    
    if (error) {
      console.error('Error deleting old posts:', error);
      return;
    }
    
    console.log(`Deleted ${data.length} old posts`);
    
    // Also delete associated likes and comments
    // This assumes you have foreign key constraints set up in your database
    // that will automatically delete related records
    
  } catch (error) {
    console.error('Error in cleanup job:', error);
  }
};

// Start the cleanup service
const start = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', deleteOldPosts);
  console.log('Cleanup service started: Will run daily at midnight');
};

module.exports = {
  start,
  deleteOldPosts
};