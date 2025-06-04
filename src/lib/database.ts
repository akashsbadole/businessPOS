import { createClient } from "@libsql/client";

// Database configuration
const dbUrl = import.meta.env.VITE_TURSO_DATABASE_URL || "file:local.db";
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

export const db = createClient({
  url: dbUrl,
  authToken: authToken,
});

// Database schema creation
export const createTables = async () => {
  try {
    // Products table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        price REAL NOT NULL,
        cost REAL DEFAULT 0,
        stock INTEGER DEFAULT 0,
        minStock INTEGER DEFAULT 5,
        hsn TEXT,
        taxRate REAL DEFAULT 18,
        barcode TEXT UNIQUE,
        description TEXT,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Customers table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT UNIQUE,
        email TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        pincode TEXT,
        gstin TEXT,
        totalOrders INTEGER DEFAULT 0,
        totalSpent REAL DEFAULT 0,
        loyaltyPoints INTEGER DEFAULT 0,
        tier TEXT DEFAULT 'bronze',
        status TEXT DEFAULT 'active',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Transactions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        invoiceNumber TEXT UNIQUE NOT NULL,
        customerId TEXT,
        subtotal REAL NOT NULL,
        discount REAL DEFAULT 0,
        taxAmount REAL DEFAULT 0,
        total REAL NOT NULL,
        paymentMethod TEXT NOT NULL,
        paymentStatus TEXT DEFAULT 'paid',
        amountReceived REAL DEFAULT 0,
        changeAmount REAL DEFAULT 0,
        pendingAmount REAL DEFAULT 0,
        notes TEXT,
        locationId TEXT,
        createdBy TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customerId) REFERENCES customers (id)
      )
    `);

    // Transaction items table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS transaction_items (
        id TEXT PRIMARY KEY,
        transaction_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit_price REAL NOT NULL,
        discount REAL DEFAULT 0,
        tax_rate REAL DEFAULT 0,
        total REAL NOT NULL,
        FOREIGN KEY (transaction_id) REFERENCES transactions (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);

    // Expenses table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        subcategory TEXT,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        vendor TEXT,
        payment_method TEXT NOT NULL,
        receipt_url TEXT,
        is_recurring BOOLEAN DEFAULT false,
        recurring_frequency TEXT,
        status TEXT DEFAULT 'paid',
        date DATE NOT NULL,
        location_id TEXT,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Locations table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pincode TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        manager TEXT,
        status TEXT DEFAULT 'active',
        is_online BOOLEAN DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT DEFAULT 'cashier',
        location_id TEXT,
        is_active BOOLEAN DEFAULT true,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (location_id) REFERENCES locations (id)
      )
    `);

    // Settings table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        description TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // GST records table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS gst_records (
        id TEXT PRIMARY KEY,
        transaction_id TEXT NOT NULL,
        cgst_rate REAL DEFAULT 0,
        sgst_rate REAL DEFAULT 0,
        igst_rate REAL DEFAULT 0,
        cgst_amount REAL DEFAULT 0,
        sgst_amount REAL DEFAULT 0,
        igst_amount REAL DEFAULT 0,
        total_gst REAL DEFAULT 0,
        hsn_code TEXT,
        is_interstate BOOLEAN DEFAULT false,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (transaction_id) REFERENCES transactions (id)
      )
    `);

    // Inventory movements table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS inventory_movements (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        movement_type TEXT NOT NULL, -- 'in', 'out', 'transfer', 'adjustment'
        quantity REAL NOT NULL,
        from_location_id TEXT,
        to_location_id TEXT,
        reference_id TEXT, -- transaction_id or transfer_id
        notes TEXT,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);

    // Loyalty transactions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS loyalty_transactions (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        transaction_id TEXT,
        points_earned INTEGER DEFAULT 0,
        points_redeemed INTEGER DEFAULT 0,
        balance_after INTEGER NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (id),
        FOREIGN KEY (transaction_id) REFERENCES transactions (id)
      )
    `);

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating database tables:", error);
    throw error;
  }
};

// Initialize database
export const initializeDatabase = async () => {
  try {
    await createTables();
    await insertDefaultData();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Insert default data
const insertDefaultData = async () => {
  try {
    // Insert default location
    await db.execute({
      sql: `INSERT OR IGNORE INTO locations (id, name, address, city, state, pincode, phone, manager) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "main-store",
        "Main Store",
        "123 Business Street",
        "Mumbai",
        "Maharashtra",
        "400001",
        "+91 9876543210",
        "Store Manager",
      ],
    });

    // Insert default settings
    const defaultSettings = [
      ["business_name", "BusinessPOS Store", "general", "Business name"],
      [
        "business_address",
        "123 Business Street, Mumbai, Maharashtra 400001",
        "general",
        "Business address",
      ],
      ["business_phone", "+91 9876543210", "general", "Business phone"],
      ["business_email", "info@businesspos.com", "general", "Business email"],
      ["business_gstin", "27ABCDE1234F1Z5", "general", "Business GSTIN"],
      ["currency", "INR", "general", "Default currency"],
      ["language", "en", "general", "Default language"],
      ["tax_rate", "18", "general", "Default tax rate"],
      ["loyalty_points_rate", "1", "general", "Points per rupee spent"],
      ["invoice_prefix", "INV", "general", "Invoice number prefix"],
    ];

    for (const [key, value, category, description] of defaultSettings) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO settings (id, key, value, category, description) 
              VALUES (?, ?, ?, ?, ?)`,
        args: [key, key, value, category, description],
      });
    }

    // Insert sample products
    const sampleProducts = [
      [
        "prod-1",
        "Rice (1kg)",
        "Groceries",
        80,
        70,
        100,
        10,
        "10061010",
        5,
        "8901030875021",
      ],
      [
        "prod-2",
        "Wheat Flour (1kg)",
        "Groceries",
        45,
        40,
        150,
        15,
        "11010010",
        5,
        "8901030875022",
      ],
      [
        "prod-3",
        "Sugar (1kg)",
        "Groceries",
        50,
        45,
        80,
        10,
        "17011110",
        5,
        "8901030875023",
      ],
      [
        "prod-4",
        "Tea (250g)",
        "Beverages",
        120,
        100,
        50,
        5,
        "09023010",
        18,
        "8901030875024",
      ],
      [
        "prod-5",
        "Biscuits",
        "Snacks",
        25,
        20,
        200,
        20,
        "19059010",
        18,
        "8901030875025",
      ],
    ];

    for (const [
      id,
      name,
      category,
      price,
      cost,
      stock,
      minStock,
      hsn,
      taxRate,
      barcode,
    ] of sampleProducts) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO products (id, name, category, price, cost, stock, minStock, hsn, taxRate, barcode)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          name,
          category,
          price,
          cost,
          stock,
          minStock,
          hsn,
          taxRate,
          barcode,
        ],
      });
    }

    // Insert sample customers
    const sampleCustomers = [
      [
        "cust-1",
        "Rajesh Kumar",
        "+91 9876543210",
        "rajesh@email.com",
        "123 Main St",
        "Mumbai",
        "Maharashtra",
        "400001",
        null,
      ],
      [
        "cust-2",
        "Priya Sharma",
        "+91 9876543211",
        "priya@email.com",
        "456 Park Ave",
        "Delhi",
        "Delhi",
        "110001",
        null,
      ],
      [
        "cust-3",
        "Amit Patel",
        "+91 9876543212",
        "amit@email.com",
        "789 Garden Rd",
        "Ahmedabad",
        "Gujarat",
        "380001",
        "24ABCDE1234F1Z5",
      ],
    ];

    for (const [
      id,
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      gstin,
    ] of sampleCustomers) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO customers (id, name, phone, email, address, city, state, pincode, gstin) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [id, name, phone, email, address, city, state, pincode, gstin],
      });
    }

    console.log("Default data inserted successfully");
  } catch (error) {
    console.error("Error inserting default data:", error);
  }
};

// Database operations
export const dbOperations = {
  // Products
  async getProducts() {
    const result = await db.execute("SELECT * FROM products ORDER BY name");
    return result.rows;
  },

  async addProduct(product: any) {
    const id = `prod-${Date.now()}`;
    await db.execute({
      sql: `INSERT INTO products (id, name, category, price, cost, stock, minStock, hsn, taxRate, barcode, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        product.name,
        product.category,
        product.price,
        product.cost || 0,
        product.stock || 0,
        product.minStock || 5,
        product.hsn,
        product.taxRate || 18,
        product.barcode,
        product.description,
      ],
    });
    return id;
  },

  async updateProduct(id: string, product: any) {
    await db.execute({
      sql: `UPDATE products SET name = ?, category = ?, price = ?, cost = ?, stock = ?,
            minStock = ?, hsn = ?, taxRate = ?, barcode = ?, description = ?, updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [
        product.name,
        product.category,
        product.price,
        product.cost,
        product.stock,
        product.minStock,
        product.hsn,
        product.taxRate,
        product.barcode,
        product.description,
        id,
      ],
    });
  },

  async deleteProduct(id: string) {
    await db.execute({
      sql: "UPDATE products SET isActive = 0 WHERE id = ?",
      args: [id],
    });
  },

  // Customers
  async getCustomers() {
    const result = await db.execute(
      'SELECT * FROM customers WHERE status = "active" ORDER BY name'
    );
    return result.rows;
  },

  async addCustomer(customer: any) {
    const id = `cust-${Date.now()}`;
    await db.execute({
      sql: `INSERT INTO customers (id, name, phone, email, address, city, state, pincode, gstin, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        customer.name,
        customer.phone,
        customer.email,
        customer.address,
        customer.city,
        customer.state,
        customer.pincode,
        customer.gstin,
        customer.notes,
      ],
    });
    return id;
  },

  // Transactions
  async saveTransaction(transaction: any, items: any[]) {
    const transactionId = `txn-${Date.now()}`;
    const invoiceNumber = `INV-${Date.now()}`;

    // Insert transaction
    await db.execute({
      sql: `INSERT INTO transactions (id, invoice_number, customer_id, subtotal, discount, tax_amount, total, 
            payment_method, payment_status, amount_received, change_amount, pending_amount, notes, location_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        transactionId,
        invoiceNumber,
        transaction.customerId,
        transaction.subtotal,
        transaction.discount,
        transaction.taxAmount,
        transaction.total,
        transaction.paymentMethod,
        transaction.paymentStatus,
        transaction.amountReceived,
        transaction.changeAmount,
        transaction.pendingAmount,
        transaction.notes,
        "main-store",
      ],
    });

    // Insert transaction items
    for (const item of items) {
      await db.execute({
        sql: `INSERT INTO transaction_items (id, transaction_id, product_id, product_name, quantity, 
              unit_price, discount, tax_rate, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          `item-${Date.now()}-${Math.random()}`,
          transactionId,
          item.productId,
          item.name,
          item.quantity,
          item.price,
          item.discount || 0,
          item.taxRate || 0,
          item.total,
        ],
      });

      // Update product stock
      await db.execute({
        sql: "UPDATE products SET stock = stock - ? WHERE id = ?",
        args: [item.quantity, item.productId],
      });
    }

    return { transactionId, invoiceNumber };
  },

  // Settings
  async getSetting(key: string) {
    const result = await db.execute({
      sql: "SELECT value FROM settings WHERE key = ?",
      args: [key],
    });
    return result.rows[0]?.value;
  },

  async setSetting(key: string, value: string) {
    await db.execute({
      sql: "INSERT OR REPLACE INTO settings (id, key, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
      args: [key, key, value],
    });
  },
};
