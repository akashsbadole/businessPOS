import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './postgres-schema';
import { 
  ProductService, 
  CustomerService, 
  CategoryService 
} from '../services/postgres-database';

// Initialize database
const connectionString = process.env.DATABASE_URL || 
  'postgresql://username:password@localhost:5432/pos_database';

const pool = new Pool({
  connectionString,
});

const db = drizzle(pool, { schema });

// Sample data for demonstration
const sampleCategories = [
  { name: 'Grocery', description: 'Daily grocery items', isActive: true, sortOrder: 1 },
  { name: 'Dairy', description: 'Milk and dairy products', isActive: true, sortOrder: 2 },
  { name: 'Snacks', description: 'Snacks and confectionery', isActive: true, sortOrder: 3 },
  { name: 'Beverages', description: 'Drinks and beverages', isActive: true, sortOrder: 4 },
  { name: 'Personal Care', description: 'Personal hygiene products', isActive: true, sortOrder: 5 },
  { name: 'Household', description: 'Household items and cleaning supplies', isActive: true, sortOrder: 6 },
];

const sampleProducts = [
  {
    name: 'Tata Salt 1kg',
    price: 20,
    category: 'grocery',
    stock: 100,
    hsn: '2501',
    costPrice: 18,
    sellingPrice: 20,
    taxRate: 5,
    cgstRate: 2.5,
    sgstRate: 2.5,
    igstRate: 0,
    description: 'Premium quality iodized salt',
    barcode: '8901030001234',
  },
  {
    name: 'Aashirvaad Atta 5kg',
    price: 250,
    category: 'grocery',
    stock: 50,
    hsn: '1101',
    costPrice: 220,
    sellingPrice: 250,
    taxRate: 5,
    cgstRate: 2.5,
    sgstRate: 2.5,
    igstRate: 0,
    description: 'Whole wheat flour',
    barcode: '8901030005678',
  },
  {
    name: 'Amul Butter 100g',
    price: 50,
    category: 'dairy',
    stock: 75,
    hsn: '0405',
    costPrice: 45,
    sellingPrice: 50,
    taxRate: 12,
    cgstRate: 6,
    sgstRate: 6,
    igstRate: 0,
    description: 'Fresh butter from Amul',
    barcode: '8901030009012',
  },
  {
    name: 'Parle-G Biscuits',
    price: 10,
    category: 'snacks',
    stock: 200,
    hsn: '1905',
    costPrice: 8,
    sellingPrice: 10,
    taxRate: 12,
    cgstRate: 6,
    sgstRate: 6,
    igstRate: 0,
    description: 'Classic glucose biscuits',
    barcode: '8901030003456',
  },
  {
    name: 'Coca Cola 250ml',
    price: 15,
    category: 'beverages',
    stock: 150,
    hsn: '2202',
    costPrice: 12,
    sellingPrice: 15,
    taxRate: 28,
    cgstRate: 14,
    sgstRate: 14,
    igstRate: 0,
    description: 'Refreshing cola drink',
    barcode: '8901030007890',
  },
];

const sampleCustomers = [
  {
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    email: 'rajesh@example.com',
    address: '123 Residential Area, Sector 1',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    gstin: '',
    status: 'active' as const,
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    name: 'Priya Sharma',
    phone: '+91 9876543211',
    email: 'priya@example.com',
    address: '456 Housing Society, Block B',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    gstin: '',
    status: 'active' as const,
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    name: 'ABC Enterprises',
    phone: '+91 9876543212',
    email: 'contact@abcenterprises.com',
    address: '789 Business Park, Tower A',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    gstin: '27ABCDE1234F1Z5',
    status: 'active' as const,
    totalOrders: 0,
    totalSpent: 0,
  },
];

export async function runMigration() {
  try {
    console.log('🚀 Starting PostgreSQL database migration...');

    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Create categories
    console.log('📁 Creating categories...');
    for (const categoryData of sampleCategories) {
      await db.insert(schema.categories).values({
        name: categoryData.name,
        description: categoryData.description,
        isActive: categoryData.isActive,
        sortOrder: categoryData.sortOrder,
      });
    }
    console.log(`✅ Created ${sampleCategories.length} categories`);

    // Create products
    console.log('📦 Creating products...');
    for (const productData of sampleProducts) {
      await db.insert(schema.products).values({
        name: productData.name,
        price: productData.price.toString(),
        category: productData.category,
        stock: productData.stock,
        hsn: productData.hsn,
        costPrice: productData.costPrice.toString(),
        sellingPrice: productData.sellingPrice.toString(),
        taxRate: productData.taxRate.toString(),
        cgstRate: productData.cgstRate.toString(),
        sgstRate: productData.sgstRate.toString(),
        igstRate: productData.igstRate.toString(),
        description: productData.description,
        barcode: productData.barcode,
      });
    }
    console.log(`✅ Created ${sampleProducts.length} products`);

    // Create customers
    console.log('👥 Creating customers...');
    for (const customerData of sampleCustomers) {
      await db.insert(schema.customers).values({
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        pincode: customerData.pincode,
        gstin: customerData.gstin,
        status: customerData.status,
        totalOrders: customerData.totalOrders,
        totalSpent: customerData.totalSpent.toString(),
      });
    }
    console.log(`✅ Created ${sampleCustomers.length} customers`);

    // Create default business settings
    console.log('⚙️ Creating business settings...');
    await db.insert(schema.businessSettings).values({
      businessName: 'Your Business Name',
      address: 'Your Business Address',
      city: 'Your City',
      state: 'Your State',
      pincode: '123456',
      phone: '+91 9876543210',
      email: 'contact@yourbusiness.com',
      gstin: '27XXXXXXXX1ZX',
      invoicePrefix: 'INV',
      defaultTaxRate: '18',
      defaultCgstRate: '9',
      defaultSgstRate: '9',
      defaultIgstRate: '0',
      currencySymbol: '₹',
    });
    console.log('✅ Created business settings');

    // Create default payment methods
    console.log('💳 Creating payment methods...');
    const paymentMethods = [
      { name: 'Cash', type: 'cash', isActive: true, charges: '0', chargeType: 'fixed' },
      { name: 'UPI', type: 'upi', isActive: true, charges: '0', chargeType: 'fixed' },
      { name: 'Credit Card', type: 'card', isActive: true, charges: '2', chargeType: 'percentage' },
      { name: 'Debit Card', type: 'card', isActive: true, charges: '1', chargeType: 'percentage' },
      { name: 'Bank Transfer', type: 'bank_transfer', isActive: true, charges: '0', chargeType: 'fixed' },
    ];

    for (const method of paymentMethods) {
      await db.insert(schema.paymentMethods).values(method);
    }
    console.log(`✅ Created ${paymentMethods.length} payment methods`);

    // Create expense categories
    console.log('💰 Creating expense categories...');
    const expenseCategories = [
      { name: 'Rent', description: 'Store rent and utilities', isActive: true },
      { name: 'Salaries', description: 'Employee salaries and wages', isActive: true },
      { name: 'Marketing', description: 'Advertising and promotional expenses', isActive: true },
      { name: 'Office Supplies', description: 'Stationery and office equipment', isActive: true },
      { name: 'Transportation', description: 'Delivery and transportation costs', isActive: true },
      { name: 'Maintenance', description: 'Equipment and store maintenance', isActive: true },
    ];

    for (const category of expenseCategories) {
      await db.insert(schema.expenseCategories).values(category);
    }
    console.log(`✅ Created ${expenseCategories.length} expense categories`);

    // Create default invoice template
    console.log('📄 Creating invoice template...');
    await db.insert(schema.invoiceTemplates).values({
      name: 'Standard Invoice',
      template: JSON.stringify({
        type: 'standard',
        showLogo: true,
        showGST: true,
        showHSN: true,
        footerText: 'Thank you for your business!',
      }),
      isDefault: true,
      isActive: true,
    });
    console.log('✅ Created default invoice template');

    console.log('🎉 PostgreSQL database migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${sampleCategories.length}`);
    console.log(`- Products: ${sampleProducts.length}`);
    console.log(`- Customers: ${sampleCustomers.length}`);
    console.log(`- Payment Methods: ${paymentMethods.length}`);
    console.log(`- Expense Categories: ${expenseCategories.length}`);
    console.log('- Business Settings: 1');
    console.log('- Invoice Template: 1');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
