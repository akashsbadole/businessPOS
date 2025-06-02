#!/usr/bin/env node

/**
 * Database Setup Helper Script
 * This script helps you set up your Turso database for the POS system
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

console.log('🚀 POS System Database Setup');
console.log('============================\n');

async function main() {
  try {
    // Check if .env exists
    if (!existsSync('.env')) {
      console.log('📝 Creating .env file from .env.example...');
      const envExample = readFileSync('.env.example', 'utf8');
      writeFileSync('.env', envExample);
      console.log('✅ .env file created\n');
    }

    console.log('🔧 Let\'s configure your Turso database!\n');

    // Get database URL
    const dbUrl = await question('Enter your Turso database URL: ');
    if (!dbUrl.trim()) {
      console.log('❌ Database URL is required');
      process.exit(1);
    }

    // Get auth token
    const authToken = await question('Enter your Turso auth token: ');
    if (!authToken.trim()) {
      console.log('❌ Auth token is required');
      process.exit(1);
    }

    // Update .env file
    console.log('\n📝 Updating .env file...');
    let envContent = readFileSync('.env', 'utf8');
    
    // Update Turso credentials
    envContent = envContent.replace(
      /VITE_TURSO_DATABASE_URL=.*/,
      `VITE_TURSO_DATABASE_URL=${dbUrl}`
    );
    envContent = envContent.replace(
      /VITE_TURSO_AUTH_TOKEN=.*/,
      `VITE_TURSO_AUTH_TOKEN=${authToken}`
    );
    envContent = envContent.replace(
      /TURSO_DATABASE_URL=.*/,
      `TURSO_DATABASE_URL=${dbUrl}`
    );
    envContent = envContent.replace(
      /TURSO_AUTH_TOKEN=.*/,
      `TURSO_AUTH_TOKEN=${authToken}`
    );

    writeFileSync('.env', envContent);
    console.log('✅ .env file updated\n');

    // Ask if user wants to push schema
    const pushSchema = await question('Do you want to push the database schema now? (y/n): ');
    
    if (pushSchema.toLowerCase() === 'y' || pushSchema.toLowerCase() === 'yes') {
      console.log('\n🔄 Pushing database schema...');
      try {
        execSync('npm run db:push', { stdio: 'inherit' });
        console.log('✅ Database schema pushed successfully!\n');

        // Ask about dummy data
        const loadDummy = await question('Do you want to load dummy data? (y/n): ');
        
        if (loadDummy.toLowerCase() === 'y' || loadDummy.toLowerCase() === 'yes') {
          console.log('\n📊 Loading dummy data...');
          try {
            execSync('npm run load-dummy-data', { stdio: 'inherit' });
            console.log('✅ Dummy data loaded successfully!\n');
          } catch (error) {
            console.log('⚠️ Dummy data loading failed. You can load it later from the dashboard.\n');
          }
        }

      } catch (error) {
        console.log('❌ Failed to push schema. Please check your credentials and try again.\n');
        console.log('You can manually run: npm run db:push\n');
      }
    }

    console.log('🎉 Setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open: http://localhost:5173');
    console.log('3. Go to Dashboard → Admin Tools to manage data');
    console.log('\nHappy coding! 🚀');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

main();
