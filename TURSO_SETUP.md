# 🚀 Turso Database Setup Guide

This guide will help you set up Turso (SQLite) database for your POS system.

## 📋 Prerequisites

1. **Turso Account**: Sign up at [turso.tech](https://turso.tech)
2. **Turso CLI**: Install the Turso CLI tool
3. **Node.js**: Ensure you have Node.js installed

## 🛠️ Step 1: Install Turso CLI

### macOS/Linux:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### Windows:
```powershell
powershell -c "irm get.tur.so/install.ps1 | iex"
```

### Alternative (npm):
```bash
npm install -g @libsql/client
```

## 🔐 Step 2: Authenticate with Turso

```bash
turso auth login
```

This will open your browser to authenticate with GitHub.

## 🗄️ Step 3: Create a Database

```bash
# Create a new database
turso db create pos-system

# List your databases to confirm
turso db list
```

## 🔑 Step 4: Get Database Credentials

```bash
# Get the database URL
turso db show pos-system --url

# Create an auth token
turso db tokens create pos-system
```

## ⚙️ Step 5: Configure Environment Variables

Update your `.env` file with the Turso credentials:

```env
# Database Configuration
DB_TYPE=turso

# Turso Database Configuration
VITE_TURSO_DATABASE_URL=libsql://your-database-url.turso.io
VITE_TURSO_AUTH_TOKEN=your_auth_token_here

# Local SQLite fallback (for development)
VITE_LOCAL_DB_PATH=./local.db
```

## 🚀 Step 6: Test the Connection

Start your application:

```bash
npm run dev
```

You should see in the console:
```
🚀 Using Turso SQLite database
Database tables initialized successfully
```

## 📊 Step 7: Verify Database Setup

1. **Check Console Logs**: Look for successful database initialization
2. **Test POS Features**: Try adding products, customers, and creating transactions
3. **Check Turso Dashboard**: Visit [app.turso.tech](https://app.turso.tech) to see your data

## 🔧 Database Schema

The system automatically creates these tables:

### Products
- `id` (TEXT PRIMARY KEY)
- `name`, `barcode`, `category`, `price`, `cost`
- `stock`, `minStock`, `maxStock`, `unit`
- `description`, `hsn`, `taxRate`
- `isActive`, `createdAt`, `updatedAt`

### Customers
- `id` (TEXT PRIMARY KEY)
- `name`, `phone`, `email`, `address`
- `city`, `state`, `pincode`, `gstin`
- `totalOrders`, `totalSpent`, `status`
- `createdAt`, `updatedAt`

### Categories
- `id` (TEXT PRIMARY KEY)
- `name`, `description`, `sortOrder`
- `isActive`, `createdAt`

### Suppliers
- `id` (TEXT PRIMARY KEY)
- `name`, `phone`, `email`, `address`
- `city`, `state`, `pincode`, `gstin`
- `status`, `createdAt`, `updatedAt`

### Transactions
- `id` (TEXT PRIMARY KEY)
- `invoiceNumber`, `customer`, `date`
- `subtotal`, `discount`, `taxAmount`, `roundOff`
- `amount`, `paymentMethod`, `amountReceived`, `change`
- `status`, `items` (JSON), `createdAt`

### Barcode Mappings
- `id` (TEXT PRIMARY KEY)
- `barcode`, `productId`, `isActive`
- `createdAt`

## 🔄 Migration from localStorage

If you have existing data in localStorage, you can migrate it:

1. **Export Data**: Use browser dev tools to export localStorage data
2. **Import to Turso**: Create a migration script to insert data into Turso
3. **Verify**: Test all functionality with migrated data

## 🌍 Multi-Region Setup

For better performance, you can create replicas:

```bash
# Create a replica in a different region
turso db replicate pos-system --to-location fra

# List replicas
turso db show pos-system
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files to version control
2. **Token Rotation**: Regularly rotate your auth tokens
3. **Access Control**: Use Turso's access control features for production
4. **Backup**: Set up regular backups of your database

## 🐛 Troubleshooting

### Connection Issues
```bash
# Test connection
turso db shell pos-system

# Check database status
turso db show pos-system
```

### Environment Variables Not Loading
- Ensure `.env` file is in the project root
- Restart your development server
- Check for typos in variable names

### Database Not Initializing
- Check console for error messages
- Verify auth token is valid
- Ensure database URL is correct

## 📈 Performance Tips

1. **Indexes**: The system automatically creates indexes for common queries
2. **Connection Pooling**: Turso handles connection pooling automatically
3. **Caching**: Consider implementing client-side caching for frequently accessed data
4. **Batch Operations**: Use batch operations for bulk inserts/updates

## 🔄 Switching Between Databases

The system supports multiple database backends:

### Use Turso (Cloud):
```env
DB_TYPE=turso
VITE_TURSO_DATABASE_URL=your_url
VITE_TURSO_AUTH_TOKEN=your_token
```

### Use Local SQLite:
```env
DB_TYPE=turso
# Leave Turso credentials empty
VITE_LOCAL_DB_PATH=./local.db
```

### Use localStorage (Default):
```env
DB_TYPE=sqlite
# or remove DB_TYPE entirely
```

## 📞 Support

- **Turso Documentation**: [docs.turso.tech](https://docs.turso.tech)
- **Turso Discord**: [discord.gg/turso](https://discord.gg/turso)
- **GitHub Issues**: Report issues in your project repository

## ✅ Verification Checklist

- [ ] Turso CLI installed and authenticated
- [ ] Database created successfully
- [ ] Environment variables configured
- [ ] Application starts without errors
- [ ] Database tables created automatically
- [ ] POS features working (add products, customers, transactions)
- [ ] Data persists between application restarts
- [ ] Console shows "🚀 Using Turso SQLite database"

Your POS system is now powered by Turso! 🎉
