#!/usr/bin/env node

/**
 * Manual Schema Push Script
 * This script manually creates the database schema in Turso
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

// SQL schema for the POS system
const schema = [
  // Categories table
  `CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // Suppliers table
  `CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    gstin TEXT,
    payment_terms TEXT DEFAULT 'Net 30',
    credit_limit REAL DEFAULT 0,
    current_balance REAL DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // Products table
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    cost REAL DEFAULT 0,
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 100,
    unit TEXT DEFAULT 'pcs',
    hsn TEXT,
    barcode TEXT,
    tax_rate REAL DEFAULT 18,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // Customers table
  `CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    gstin TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spent REAL DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // Transactions table
  `CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    invoice_number TEXT NOT NULL UNIQUE,
    date TEXT NOT NULL,
    customer TEXT NOT NULL,
    items TEXT NOT NULL, -- JSON array of cart items
    subtotal REAL NOT NULL,
    discount REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    amount REAL NOT NULL,
    amount_received REAL DEFAULT 0,
    change REAL DEFAULT 0,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'completed',
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // Invoice items table
  `CREATE TABLE IF NOT EXISTS invoice_items (
    id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    total REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`,

  // Store settings table
  `CREATE TABLE IF NOT EXISTS store_settings (
    id TEXT PRIMARY KEY,
    store_name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    gstin TEXT,
    logo BLOB,
    tax_rate REAL DEFAULT 18,
    currency TEXT DEFAULT 'INR',
    invoice_prefix TEXT DEFAULT 'INV',
    invoice_counter INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`
];

async function pushSchema() {
  console.log('🚀 Pushing POS System Schema to Turso...');
  console.log('==========================================\n');

  try {
    console.log('📡 Testing connection...');
    await client.execute('SELECT 1');
    console.log('✅ Connection successful!\n');

    console.log('📊 Creating tables...');
    
    for (let i = 0; i < schema.length; i++) {
      const sql = schema[i];
      const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || `table_${i + 1}`;
      
      try {
        console.log(`   📋 Creating ${tableName}...`);
        await client.execute(sql);
        console.log(`   ✅ ${tableName} created successfully`);
      } catch (error) {
        console.log(`   ❌ Failed to create ${tableName}: ${error.message}`);
      }
    }

    console.log('\n🎉 Schema push completed!');
    console.log('✅ All tables have been created in your Turso database');
    console.log('\n📋 Created tables:');
    console.log('   📂 categories - Product categories');
    console.log('   🏢 suppliers - Supplier information');
    console.log('   📦 products - Product catalog');
    console.log('   👥 customers - Customer database');
    console.log('   🧾 transactions - Sales transactions');
    console.log('   📄 invoice_items - Transaction line items');
    console.log('   ⚙️ store_settings - Store configuration');

    console.log('\n🎯 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Go to Dashboard → Admin Tools');
    console.log('   3. Click "Load Dummy Data"');
    console.log('   4. Start using your POS system!');

  } catch (error) {
    console.log('❌ Schema push failed!');
    console.log(`💥 Error: ${error.message}`);
    process.exit(1);
  }
}

pushSchema().catch(console.error);
