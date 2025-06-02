import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// This would be used in a real application
// For now, we'll use in-memory data for the demo
export const createDb = () => {
  const sqlite = new Database(':memory:');
  return drizzle(sqlite, { schema });
};

// Example of how to use the database in a real application:
/*
import { db } from './db';
import { products } from './schema';

// Insert a product
const insertProduct = async (product) => {
  return await db.insert(products).values(product).returning();
};

// Get all products
const getAllProducts = async () => {
  return await db.select().from(products);
};

// Get product by id
const getProductById = async (id) => {
  return await db.select().from(products).where(eq(products.id, id));
};

// Update product
const updateProduct = async (id, product) => {
  return await db.update(products).set(product).where(eq(products.id, id)).returning();
};

// Delete product
const deleteProduct = async (id) => {
  return await db.delete(products).where(eq(products.id, id)).returning();
};
*/
