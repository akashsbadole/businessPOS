#!/usr/bin/env node

/**
 * Test Transaction Creation
 * This script tests creating a transaction to debug the "Unsupported type of value" error
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

// Helper functions
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const formatDate = (date) => {
  return date.toISOString();
};

async function testTransactionCreation() {
  console.log('🧪 Testing Transaction Creation...');
  console.log('==================================\n');

  try {
    // Test data
    const testTransaction = {
      invoiceNumber: 'TEST-001',
      customer: null,
      date: new Date(),
      subtotal: 100,
      discount: 0,
      taxAmount: 18,
      roundOff: 0,
      amount: 118,
      paymentMethod: 'Cash',
      amountReceived: 120,
      change: 2,
      status: 'completed',
      items: [
        {
          id: 'test-product-1',
          name: 'Test Product',
          price: 100,
          quantity: 1
        }
      ]
    };

    console.log('📋 Test transaction data:');
    console.log(JSON.stringify(testTransaction, null, 2));

    // Prepare values exactly like the service does
    const id = generateId();
    const now = formatDate(new Date());

    const values = [
      String(id),
      String(testTransaction.invoiceNumber),
      testTransaction.customer ? String(testTransaction.customer) : null,
      formatDate(testTransaction.date),
      Number(testTransaction.subtotal || 0),
      Number(testTransaction.discount || 0),
      Number(testTransaction.taxAmount || 0),
      Number(testTransaction.roundOff || 0),
      Number(testTransaction.amount),
      String(testTransaction.paymentMethod),
      Number(testTransaction.amountReceived || 0),
      Number(testTransaction.change || 0),
      String(testTransaction.status || 'completed'),
      JSON.stringify(testTransaction.items || []),
      String(now),
    ];

    console.log('\n🔍 Values to be inserted:');
    values.forEach((value, index) => {
      console.log(`  [${index}]: ${typeof value} = ${value}`);
    });

    console.log('\n📡 Attempting to insert transaction...');

    await client.execute(
      `INSERT INTO transactions (
        id, invoiceNumber, customer, date, subtotal, discount, taxAmount, roundOff,
        amount, paymentMethod, amountReceived, change, status, items, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    console.log('✅ Transaction created successfully!');
    console.log(`📊 Transaction ID: ${id}`);

    // Verify the transaction was created
    const result = await client.execute(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );

    if (result.rows.length > 0) {
      console.log('\n✅ Transaction verified in database:');
      console.log(JSON.stringify(result.rows[0], null, 2));
    }

  } catch (error) {
    console.log('❌ Transaction creation failed!');
    console.log(`💥 Error: ${error.message}`);
    console.log(`📋 Error details:`, error);
    
    if (error.message.includes('Unsupported type of value')) {
      console.log('\n🔧 This is the "Unsupported type of value" error!');
      console.log('💡 One of the values is not a supported SQLite type');
    }
  }
}

testTransactionCreation().catch(console.error);
