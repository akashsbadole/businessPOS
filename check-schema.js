#!/usr/bin/env node

/**
 * Check Database Schema
 * This script checks what tables and columns exist in the database
 */

import { createClient } from '@libsql/client';
import { config } from 'dotenv';

// Load environment variables
config();

const url = process.env.TURSO_DATABASE_URL || process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.log('❌ Missing Turso credentials in environment variables');
  process.exit(1);
}

const client = createClient({
  url: url,
  authToken: authToken,
});

async function checkSchema() {
  console.log('🔍 Checking Database Schema...');
  console.log('==============================\n');

  try {
    // Get list of tables
    console.log('📋 Tables in database:');
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    if (tables.rows.length === 0) {
      console.log('   ❌ No tables found in database');
      return;
    }

    for (const table of tables.rows) {
      const tableName = table.name;
      console.log(`\n📊 Table: ${tableName}`);
      
      // Get column information
      const columns = await client.execute(`PRAGMA table_info(${tableName})`);
      
      console.log('   Columns:');
      for (const column of columns.rows) {
        console.log(`     - ${column.name} (${column.type}) ${column.notnull ? 'NOT NULL' : ''} ${column.dflt_value ? `DEFAULT ${column.dflt_value}` : ''}`);
      }
    }

    console.log('\n✅ Schema check completed!');

  } catch (error) {
    console.log('❌ Failed to check schema:', error.message);
    process.exit(1);
  }
}

checkSchema().catch(console.error);
