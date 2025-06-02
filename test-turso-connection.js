#!/usr/bin/env node

/**
 * Test Turso Database Connection
 * This script tests if your Turso credentials are working
 */

import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Load environment variables
config();

async function testConnection() {
  console.log('🔍 Testing Turso Database Connection...');
  console.log('=====================================\n');

  const url = process.env.TURSO_DATABASE_URL || process.env.VITE_TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN;

  if (!url) {
    console.log('❌ TURSO_DATABASE_URL not found in environment variables');
    console.log('💡 Make sure your .env file contains TURSO_DATABASE_URL');
    process.exit(1);
  }

  if (!authToken) {
    console.log('❌ TURSO_AUTH_TOKEN not found in environment variables');
    console.log('💡 Make sure your .env file contains TURSO_AUTH_TOKEN');
    process.exit(1);
  }

  console.log('📋 Configuration:');
  console.log(`   Database URL: ${url}`);
  console.log(`   Auth Token: ${authToken.substring(0, 20)}...`);
  console.log('');

  try {
    console.log('🔌 Creating database client...');
    const client = createClient({
      url: url,
      authToken: authToken,
    });

    console.log('📡 Testing connection...');
    const result = await client.execute('SELECT 1 as test');
    
    if (result.rows.length > 0) {
      console.log('✅ Connection successful!');
      console.log(`📊 Test query result: ${JSON.stringify(result.rows[0])}`);
      
      // Test if we can create a simple table
      console.log('\n🧪 Testing table creation...');
      try {
        await client.execute('CREATE TABLE IF NOT EXISTS connection_test (id INTEGER PRIMARY KEY, created_at TEXT DEFAULT CURRENT_TIMESTAMP)');
        await client.execute('INSERT INTO connection_test (id) VALUES (1)');
        const testResult = await client.execute('SELECT * FROM connection_test LIMIT 1');
        console.log('✅ Table creation and insertion successful!');
        console.log(`📊 Table test result: ${JSON.stringify(testResult.rows[0])}`);
        
        // Clean up
        await client.execute('DROP TABLE connection_test');
        console.log('🧹 Cleanup completed');
      } catch (tableError) {
        console.log('⚠️ Table creation test failed:', tableError.message);
      }
      
    } else {
      console.log('⚠️ Connection established but no data returned');
    }

    console.log('\n🎉 Turso connection test completed successfully!');
    console.log('✅ Your credentials are working correctly');
    console.log('✅ You can now run: npm run db:push');

  } catch (error) {
    console.log('❌ Connection failed!');
    console.log(`💥 Error: ${error.message}`);
    
    if (error.message.includes('401')) {
      console.log('\n🔧 Troubleshooting 401 Error:');
      console.log('   1. Your auth token may have expired');
      console.log('   2. Check if your database name is correct');
      console.log('   3. Try creating a new auth token:');
      console.log('      turso db tokens create your-database-name');
    } else if (error.message.includes('404')) {
      console.log('\n🔧 Troubleshooting 404 Error:');
      console.log('   1. Database may not exist');
      console.log('   2. Check your database URL');
      console.log('   3. List your databases: turso db list');
    } else {
      console.log('\n🔧 General troubleshooting:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify your .env file has correct values');
      console.log('   3. Try logging into Turso CLI: turso auth login');
    }
    
    process.exit(1);
  }
}

testConnection().catch(console.error);
