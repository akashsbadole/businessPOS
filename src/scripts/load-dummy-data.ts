/**
 * Script to load dummy data into the database
 * This can be run independently to populate the database with sample data
 */

import { loadDummyData } from '../data/dummy-database';

const main = async () => {
  console.log('🚀 Starting dummy data loading script...');
  console.log('=====================================');
  
  try {
    const result = await loadDummyData();
    
    if (result.success) {
      console.log('✅ SUCCESS!');
      console.log(`📊 ${result.message}`);
      
      if (result.counts) {
        console.log('\n📈 Data loaded:');
        console.log(`   📂 Categories: ${result.counts.categories}`);
        console.log(`   🏢 Suppliers: ${result.counts.suppliers}`);
        console.log(`   📦 Products: ${result.counts.products}`);
        console.log(`   👥 Customers: ${result.counts.customers}`);
        console.log(`   🧾 Transactions: ${result.counts.transactions}`);
        
        const total = Object.values(result.counts).reduce((sum, count) => sum + count, 0);
        console.log(`   🎯 Total Records: ${total}`);
      }
    } else {
      console.log('❌ FAILED!');
      console.log(`💥 ${result.message}`);
      if (result.error) {
        console.log(`🔍 Error: ${result.error}`);
      }
    }
    
  } catch (error) {
    console.error('💥 Script failed with error:', error);
    process.exit(1);
  }
  
  console.log('\n=====================================');
  console.log('🏁 Script completed!');
};

// Run the script if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as loadDummyDataScript };
