import { db, campaigns } from '../lib/db';

async function cleanupCampaigns() {
  try {
    console.log('🧹 Cleaning up campaigns table...');
    
    // Delete all existing campaigns
    const result = await db.delete(campaigns);
    console.log('✅ All campaigns deleted successfully');
    
    console.log('🎉 Campaigns table is now clean and ready for new data');
    console.log('💡 You can now create new campaigns through the UI and they will have proper review status');
    
  } catch (error) {
    console.error('❌ Error cleaning up campaigns:', error);
    throw error;
  }
}

// Run the cleanup function
cleanupCampaigns()
  .then(() => {
    console.log('✨ Cleanup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Cleanup failed:', error);
    process.exit(1);
  });
