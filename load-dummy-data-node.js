#!/usr/bin/env node

/**
 * Node.js Compatible Dummy Data Loader
 * This script loads dummy data directly into Turso database
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

// Generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Sample data (subset for testing) - using correct column names
const sampleCategories = [
  { id: generateId(), name: 'Electronics', description: 'Electronic devices and accessories', sortOrder: 1, isActive: 1, createdAt: new Date().toISOString() },
  { id: generateId(), name: 'Clothing', description: 'Apparel and fashion items', sortOrder: 2, isActive: 1, createdAt: new Date().toISOString() },
  { id: generateId(), name: 'Food & Beverages', description: 'Food items and drinks', sortOrder: 3, isActive: 1, createdAt: new Date().toISOString() },
];

const sampleSuppliers = [
  { id: generateId(), name: 'TechWorld Distributors', phone: '+91-9876543210', email: 'contact@techworld.com', address: '123 Tech Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', gstin: '27AAAAA0000A1Z5', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: generateId(), name: 'Fashion Hub Suppliers', phone: '+91-9876543211', email: 'sales@fashionhub.com', address: '456 Fashion Avenue', city: 'Delhi', state: 'Delhi', pincode: '110001', gstin: '07BBBBB0000B1Z5', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const sampleProducts = [
  { id: generateId(), name: 'Samsung Galaxy S24', price: 79999, category: 'Electronics', stock: 25, hsn: '85171200', barcode: '8901030895647', description: 'Latest Samsung flagship smartphone', cost: 65000, minStock: 5, maxStock: 50, unit: 'pcs', isActive: 1, taxRate: 18, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: generateId(), name: 'iPhone 15 Pro', price: 134900, category: 'Electronics', stock: 15, hsn: '85171200', barcode: '8901030895648', description: 'Apple iPhone 15 Pro 128GB', cost: 110000, minStock: 3, maxStock: 30, unit: 'pcs', isActive: 1, taxRate: 18, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: generateId(), name: 'Levi\'s 501 Jeans', price: 4999, category: 'Clothing', stock: 45, hsn: '62034200', barcode: '8901030895657', description: 'Classic Levi\'s 501 original fit jeans', cost: 3500, minStock: 15, maxStock: 60, unit: 'pcs', isActive: 1, taxRate: 12, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const sampleCustomers = [
  { id: generateId(), name: 'Rajesh Kumar', phone: '+91-9876543210', email: 'rajesh.kumar@email.com', totalOrders: 15, totalSpent: 45000, status: 'active', address: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', gstin: '27AAAAA0000A1Z5', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: generateId(), name: 'Priya Sharma', phone: '+91-9876543211', email: 'priya.sharma@email.com', totalOrders: 22, totalSpent: 67500, status: 'active', address: '456 CP Road', city: 'Delhi', state: 'Delhi', pincode: '110001', gstin: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

async function loadData() {
  console.log('🚀 Loading Dummy Data into Turso Database...');
  console.log('=============================================\n');

  try {
    console.log('📡 Testing connection...');
    await client.execute('SELECT 1');
    console.log('✅ Connection successful!\n');

    let loadedCounts = {
      categories: 0,
      suppliers: 0,
      products: 0,
      customers: 0,
      transactions: 0
    };

    // Load Categories
    console.log('📂 Loading categories...');
    for (const category of sampleCategories) {
      try {
        await client.execute({
          sql: `INSERT INTO categories (id, name, description, sortOrder, isActive, createdAt)
                VALUES (?, ?, ?, ?, ?, ?)`,
          args: [category.id, category.name, category.description, category.sortOrder, category.isActive, category.createdAt]
        });
        loadedCounts.categories++;
        console.log(`   ✅ ${category.name}`);
      } catch (error) {
        console.log(`   ⚠️ Failed to create category ${category.name}: ${error.message}`);
      }
    }

    // Load Suppliers
    console.log('\n🏢 Loading suppliers...');
    for (const supplier of sampleSuppliers) {
      try {
        await client.execute({
          sql: `INSERT INTO suppliers (id, name, phone, email, address, city, state, pincode, gstin, status, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [supplier.id, supplier.name, supplier.phone, supplier.email, supplier.address, supplier.city, supplier.state, supplier.pincode, supplier.gstin, supplier.status, supplier.createdAt, supplier.updatedAt]
        });
        loadedCounts.suppliers++;
        console.log(`   ✅ ${supplier.name}`);
      } catch (error) {
        console.log(`   ⚠️ Failed to create supplier ${supplier.name}: ${error.message}`);
      }
    }

    // Load Products
    console.log('\n📦 Loading products...');
    for (const product of sampleProducts) {
      try {
        await client.execute({
          sql: `INSERT INTO products (id, name, description, category, price, cost, stock, minStock, maxStock, unit, hsn, barcode, taxRate, isActive, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [product.id, product.name, product.description, product.category, product.price, product.cost, product.stock, product.minStock, product.maxStock, product.unit, product.hsn, product.barcode, product.taxRate, product.isActive, product.createdAt, product.updatedAt]
        });
        loadedCounts.products++;
        console.log(`   ✅ ${product.name}`);
      } catch (error) {
        console.log(`   ⚠️ Failed to create product ${product.name}: ${error.message}`);
      }
    }

    // Load Customers
    console.log('\n👥 Loading customers...');
    for (const customer of sampleCustomers) {
      try {
        await client.execute({
          sql: `INSERT INTO customers (id, name, phone, email, address, city, state, pincode, gstin, totalOrders, totalSpent, status, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [customer.id, customer.name, customer.phone, customer.email, customer.address, customer.city, customer.state, customer.pincode, customer.gstin, customer.totalOrders, customer.totalSpent, customer.status, customer.createdAt, customer.updatedAt]
        });
        loadedCounts.customers++;
        console.log(`   ✅ ${customer.name}`);
      } catch (error) {
        console.log(`   ⚠️ Failed to create customer ${customer.name}: ${error.message}`);
      }
    }

    // Create a sample transaction
    console.log('\n🧾 Creating sample transaction...');
    const transactionId = generateId();
    const invoiceNumber = 'INV-2024-001';
    const customerId = sampleCustomers[0].id;
    const productId = sampleProducts[0].id;

    const items = JSON.stringify([{
      id: productId,
      name: sampleProducts[0].name,
      price: sampleProducts[0].price,
      quantity: 1
    }]);

    try {
      await client.execute({
        sql: `INSERT INTO transactions (id, invoiceNumber, date, customer, items, subtotal, discount, taxAmount, amount, amountReceived, change, paymentMethod, status, createdAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [transactionId, invoiceNumber, new Date().toISOString(), customerId, items, 67796, 0, 12203, 79999, 80000, 1, 'Cash', 'completed', new Date().toISOString()]
      });
      loadedCounts.transactions++;
      console.log(`   ✅ ${invoiceNumber}`);
    } catch (error) {
      console.log(`   ⚠️ Failed to create transaction: ${error.message}`);
    }

    console.log('\n🎉 Dummy data loaded successfully!');
    console.log('📊 Loaded counts:', loadedCounts);
    console.log('\n🎯 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Open: http://localhost:5173');
    console.log('   3. Go to Dashboard to see your data');
    console.log('   4. Use Admin Tools to load more data via UI');

  } catch (error) {
    console.log('❌ Failed to load dummy data:', error.message);
    process.exit(1);
  }
}

loadData().catch(console.error);
