// Test script to verify Turso database integration
import { getDatabaseInfo, ProductService, CustomerService } from './services/database-factory';

export const testTursoIntegration = async () => {
  console.log('🧪 Testing Turso Database Integration...');
  
  try {
    // Get database info
    const dbInfo = getDatabaseInfo();
    console.log('📊 Database Info:', dbInfo);
    
    // Test product operations
    console.log('🛍️ Testing Product Operations...');
    
    // Get all products
    const products = await ProductService.getAll();
    console.log(`📦 Found ${products.length} products`);
    
    // Test customer operations
    console.log('👥 Testing Customer Operations...');
    
    // Get all customers
    const customers = await CustomerService.getAll();
    console.log(`👤 Found ${customers.length} customers`);
    
    // Test creating a sample product (if none exist)
    if (products.length === 0) {
      console.log('➕ Creating sample product...');
      const sampleProduct = await ProductService.create({
        name: 'Test Product',
        price: 100,
        category: 'Test Category',
        stock: 10,
        hsn: '1234',
        description: 'Test product for Turso integration',
        cost: 80,
        minStock: 5,
        maxStock: 100,
        unit: 'pcs',
        isActive: true,
        taxRate: 18
      });
      console.log('✅ Sample product created:', sampleProduct.id);
    }
    
    // Test creating a sample customer (if none exist)
    if (customers.length === 0) {
      console.log('➕ Creating sample customer...');
      const sampleCustomer = await CustomerService.create({
        name: 'Test Customer',
        phone: '9876543210',
        email: 'test@example.com',
        totalOrders: 0,
        totalSpent: 0,
        status: 'active',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      });
      console.log('✅ Sample customer created:', sampleCustomer.id);
    }
    
    console.log('✅ Turso integration test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Turso integration test failed:', error);
    return false;
  }
};

// Auto-run test in development
if (import.meta.env.NODE_ENV === 'development') {
  // Run test after a short delay to ensure app is initialized
  setTimeout(() => {
    testTursoIntegration();
  }, 2000);
}
