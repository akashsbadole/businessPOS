import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import {
  ProductService,
  CustomerService,
  CategoryService,
  SupplierService,
  ExpenseService,
} from "../services/database";

// Initialize database
const sqlite = new Database("pos.db");
const db = drizzle(sqlite, { schema });

// Sample data for demonstration
const sampleCategories = [
  {
    name: "Grocery",
    description: "Daily grocery items",
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Dairy",
    description: "Milk and dairy products",
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Snacks",
    description: "Snacks and confectionery",
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Beverages",
    description: "Drinks and beverages",
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "Personal Care",
    description: "Personal hygiene products",
    isActive: true,
    sortOrder: 5,
  },
  {
    name: "Household",
    description: "Household items and cleaning supplies",
    isActive: true,
    sortOrder: 6,
  },
];

const sampleSuppliers = [
  {
    name: "ABC Distributors",
    contactPerson: "John Doe",
    phone: "+91 9876543210",
    email: "john@abcdist.com",
    address: "123 Main Street, Business District",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    gstin: "27AAAAA0000A1Z5",
    paymentTerms: "30",
    creditLimit: 100000,
    status: "active" as const,
  },
  {
    name: "XYZ Suppliers",
    contactPerson: "Jane Smith",
    phone: "+91 9876543211",
    email: "jane@xyzsuppliers.com",
    address: "456 Industrial Area",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    gstin: "07BBBBB1111B2Z6",
    paymentTerms: "15",
    creditLimit: 50000,
    status: "active" as const,
  },
  {
    name: "PQR Wholesale",
    contactPerson: "Mike Johnson",
    phone: "+91 9876543212",
    email: "mike@pqrwholesale.com",
    address: "789 Market Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    gstin: "29CCCCC2222C3Z7",
    paymentTerms: "45",
    creditLimit: 75000,
    status: "active" as const,
  },
];

const sampleProducts = [
  {
    name: "Tata Salt 1kg",
    price: 20,
    category: "grocery",
    stock: 100,
    hsn: "2501",
    costPrice: 18,
    sellingPrice: 20,
    taxRate: 5,
    cgstRate: 2.5,
    sgstRate: 2.5,
    igstRate: 0,
    description: "Premium quality iodized salt",
    barcode: "8901030001234",
  },
  {
    name: "Aashirvaad Atta 5kg",
    price: 250,
    category: "grocery",
    stock: 50,
    hsn: "1101",
    costPrice: 220,
    sellingPrice: 250,
    taxRate: 5,
    cgstRate: 2.5,
    sgstRate: 2.5,
    igstRate: 0,
    description: "Whole wheat flour",
    barcode: "8901030005678",
  },
  {
    name: "Amul Butter 100g",
    price: 50,
    category: "dairy",
    stock: 75,
    hsn: "0405",
    costPrice: 45,
    sellingPrice: 50,
    taxRate: 12,
    cgstRate: 6,
    sgstRate: 6,
    igstRate: 0,
    description: "Fresh butter from Amul",
    barcode: "8901030009012",
  },
  {
    name: "Parle-G Biscuits",
    price: 10,
    category: "snacks",
    stock: 200,
    hsn: "1905",
    costPrice: 8,
    sellingPrice: 10,
    taxRate: 12,
    cgstRate: 6,
    sgstRate: 6,
    igstRate: 0,
    description: "Classic glucose biscuits",
    barcode: "8901030003456",
  },
  {
    name: "Coca Cola 250ml",
    price: 15,
    category: "beverages",
    stock: 150,
    hsn: "2202",
    costPrice: 12,
    sellingPrice: 15,
    taxRate: 28,
    cgstRate: 14,
    sgstRate: 14,
    igstRate: 0,
    description: "Refreshing cola drink",
    barcode: "8901030007890",
  },
];

const sampleCustomers = [
  {
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    email: "rajesh@example.com",
    address: "123 Residential Area, Sector 1",
    gstin: "",
    status: "active" as const,
  },
  {
    name: "Priya Sharma",
    phone: "+91 9876543211",
    email: "priya@example.com",
    address: "456 Housing Society, Block B",
    gstin: "",
    status: "active" as const,
  },
  {
    name: "ABC Enterprises",
    phone: "+91 9876543212",
    email: "contact@abcenterprises.com",
    address: "789 Business Park, Tower A",
    gstin: "27ABCDE1234F1Z5",
    status: "active" as const,
  },
];

const sampleExpenseCategories = [
  { name: "Rent", description: "Store rent and utilities", isActive: true },
  {
    name: "Salaries",
    description: "Employee salaries and wages",
    isActive: true,
  },
  {
    name: "Marketing",
    description: "Advertising and promotional expenses",
    isActive: true,
  },
  {
    name: "Office Supplies",
    description: "Stationery and office equipment",
    isActive: true,
  },
  {
    name: "Transportation",
    description: "Delivery and transportation costs",
    isActive: true,
  },
  {
    name: "Maintenance",
    description: "Equipment and store maintenance",
    isActive: true,
  },
];

export async function runMigration() {
  try {
    console.log("🚀 Starting database migration...");

    // Create categories
    console.log("📁 Creating categories...");
    for (const categoryData of sampleCategories) {
      await CategoryService.create(categoryData);
    }
    console.log(`✅ Created ${sampleCategories.length} categories`);

    // Create suppliers
    console.log("🚚 Creating suppliers...");
    for (const supplierData of sampleSuppliers) {
      await SupplierService.create(supplierData);
    }
    console.log(`✅ Created ${sampleSuppliers.length} suppliers`);

    // Create products
    console.log("📦 Creating products...");
    for (const productData of sampleProducts) {
      await ProductService.create(productData);
    }
    console.log(`✅ Created ${sampleProducts.length} products`);

    // Create customers
    console.log("👥 Creating customers...");
    for (const customerData of sampleCustomers) {
      await CustomerService.create(customerData);
    }
    console.log(`✅ Created ${sampleCustomers.length} customers`);

    // Create expense categories
    console.log("💰 Creating expense categories...");
    for (const expenseCategoryData of sampleExpenseCategories) {
      await db.insert(schema.expenseCategories).values({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        ...expenseCategoryData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    console.log(
      `✅ Created ${sampleExpenseCategories.length} expense categories`
    );

    // Create default business settings
    console.log("⚙️ Creating business settings...");
    await db.insert(schema.businessSettings).values({
      id: "default",
      businessName: "Your Business Name",
      address: "Your Business Address",
      city: "Your City",
      state: "Your State",
      pincode: "123456",
      phone: "+91 9876543210",
      email: "contact@yourbusiness.com",
      gstin: "27XXXXXXXX1ZX",
      invoicePrefix: "INV",
      defaultTaxRate: 18,
      defaultCgstRate: 9,
      defaultSgstRate: 9,
      defaultIgstRate: 0,
      currencySymbol: "₹",
      updatedAt: Date.now(),
    });
    console.log("✅ Created business settings");

    // Create default payment methods
    console.log("💳 Creating payment methods...");
    const paymentMethods = [
      {
        name: "Cash",
        type: "cash",
        isActive: true,
        charges: 0,
        chargeType: "fixed",
      },
      {
        name: "UPI",
        type: "upi",
        isActive: true,
        charges: 0,
        chargeType: "fixed",
      },
      {
        name: "Credit Card",
        type: "card",
        isActive: true,
        charges: 2,
        chargeType: "percentage",
      },
      {
        name: "Debit Card",
        type: "card",
        isActive: true,
        charges: 1,
        chargeType: "percentage",
      },
      {
        name: "Bank Transfer",
        type: "bank_transfer",
        isActive: true,
        charges: 0,
        chargeType: "fixed",
      },
    ];

    for (const method of paymentMethods) {
      await db.insert(schema.paymentMethods).values({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        ...method,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    console.log(`✅ Created ${paymentMethods.length} payment methods`);

    // Create default invoice template
    console.log("📄 Creating invoice template...");
    await db.insert(schema.invoiceTemplates).values({
      id: "default",
      name: "Standard Invoice",
      template: JSON.stringify({
        type: "standard",
        showLogo: true,
        showGST: true,
        showHSN: true,
        footerText: "Thank you for your business!",
      }),
      isDefault: true,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("✅ Created default invoice template");

    console.log("🎉 Database migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Categories: ${sampleCategories.length}`);
    console.log(`- Suppliers: ${sampleSuppliers.length}`);
    console.log(`- Products: ${sampleProducts.length}`);
    console.log(`- Customers: ${sampleCustomers.length}`);
    console.log(`- Payment Methods: ${paymentMethods.length}`);
    console.log("- Business Settings: 1");
    console.log("- Invoice Template: 1");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}
