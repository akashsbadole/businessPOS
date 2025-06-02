# PostgreSQL Setup Guide for Enhanced POS System

This guide will help you set up the enhanced POS system with PostgreSQL database for production-ready data persistence.

## 🚀 Quick Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Install PostgreSQL

#### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is 5432

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create a database user
createuser --interactive
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

Connect to PostgreSQL as the postgres user:
```bash
# Windows/Linux
psql -U postgres

# macOS
psql postgres
```

Create database and user:
```sql
-- Create database
CREATE DATABASE pos_database;

-- Create user with password
CREATE USER pos_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE pos_database TO pos_user;

-- Connect to the database
\c pos_database;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO pos_user;

-- Exit
\q
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:
```env
# Database Configuration
DATABASE_URL=postgresql://pos_user:your_secure_password@localhost:5432/pos_database

# Optional: For production
NODE_ENV=production
PORT=3000
```

### 5. Run Database Migration

```bash
# Generate schema
npm run db:generate

# Push schema to database
npm run db:push

# Run migration with sample data
npm run db:migrate
```

### 6. Start the Application

```bash
npm run dev
```

## 🔧 Configuration Options

### Database Connection String Format
```
postgresql://[username]:[password]@[host]:[port]/[database]
```

### Examples:
- Local: `postgresql://pos_user:password@localhost:5432/pos_database`
- Remote: `postgresql://user:pass@db.example.com:5432/pos_db`
- With SSL: `postgresql://user:pass@host:5432/db?sslmode=require`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Application port | 5173 |

## 📊 Database Schema Overview

The PostgreSQL schema includes:

### Core Tables
- **products** - Product catalog with pricing and inventory
- **categories** - Hierarchical product categories
- **customers** - Customer database with contact info
- **suppliers** - Supplier management
- **invoices** - Sales transactions
- **invoice_items** - Line items for invoices

### Advanced Tables
- **purchase_orders** - Purchase order management
- **purchase_order_items** - PO line items
- **expenses** - Business expense tracking
- **expense_categories** - Expense categorization
- **loyalty_program** - Customer loyalty management
- **loyalty_transactions** - Points transaction history
- **promotions** - Promotional campaigns
- **staff_attendance** - Employee attendance
- **barcode_mappings** - Product barcode management
- **invoice_templates** - Customizable templates
- **inventory_transactions** - Stock movement tracking
- **payment_methods** - Payment method configuration
- **business_settings** - Business configuration

## 🛠 Database Management

### Backup Database
```bash
# Create backup
pg_dump -U pos_user -h localhost pos_database > backup.sql

# With compression
pg_dump -U pos_user -h localhost pos_database | gzip > backup.sql.gz
```

### Restore Database
```bash
# Restore from backup
psql -U pos_user -h localhost pos_database < backup.sql

# From compressed backup
gunzip -c backup.sql.gz | psql -U pos_user -h localhost pos_database
```

### Reset Database
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS pos_database;"
psql -U postgres -c "CREATE DATABASE pos_database;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE pos_database TO pos_user;"

# Run migration again
npm run db:setup
```

## 🔐 Security Best Practices

### 1. Database Security
- Use strong passwords for database users
- Limit database user privileges
- Enable SSL connections for production
- Regular security updates

### 2. Connection Security
```sql
-- Create read-only user for reports
CREATE USER pos_readonly WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE pos_database TO pos_readonly;
GRANT USAGE ON SCHEMA public TO pos_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pos_readonly;
```

### 3. Environment Security
- Never commit `.env` files to version control
- Use environment-specific configurations
- Rotate passwords regularly

## 🚀 Production Deployment

### 1. Cloud PostgreSQL Services

#### AWS RDS
```env
DATABASE_URL=postgresql://username:password@your-rds-endpoint.amazonaws.com:5432/pos_database
```

#### Google Cloud SQL
```env
DATABASE_URL=postgresql://username:password@your-cloud-sql-ip:5432/pos_database
```

#### Heroku Postgres
```env
DATABASE_URL=postgresql://username:password@hostname:5432/database
```

#### DigitalOcean Managed Database
```env
DATABASE_URL=postgresql://username:password@your-db-cluster.db.ondigitalocean.com:25060/pos_database?sslmode=require
```

### 2. Connection Pooling

For production, consider using connection pooling:

```typescript
// In your database service
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 3. Performance Optimization

#### Indexes
```sql
-- Add indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_invoices_date ON invoices(date);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
```

#### Query Optimization
- Use EXPLAIN ANALYZE to optimize slow queries
- Implement pagination for large datasets
- Use database views for complex reports

## 🔧 Troubleshooting

### Common Issues

#### Connection Refused
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

#### Authentication Failed
- Verify username and password
- Check pg_hba.conf configuration
- Ensure user has proper privileges

#### Database Does Not Exist
```sql
-- Create database if it doesn't exist
CREATE DATABASE pos_database;
```

#### Permission Denied
```sql
-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE pos_database TO pos_user;
GRANT ALL ON SCHEMA public TO pos_user;
```

### Performance Issues

#### Slow Queries
```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

#### Connection Limits
```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- Increase max connections (requires restart)
ALTER SYSTEM SET max_connections = 200;
```

## 📈 Monitoring

### Database Monitoring
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('pos_database'));

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check active connections
SELECT * FROM pg_stat_activity WHERE datname = 'pos_database';
```

### Application Monitoring
- Monitor connection pool usage
- Track query performance
- Set up alerts for database errors

## 🔄 Migration from localStorage

If you're migrating from the localStorage version:

1. **Export existing data** from the browser's localStorage
2. **Transform data format** to match PostgreSQL schema
3. **Import data** using the migration script
4. **Verify data integrity** after migration

```javascript
// Export localStorage data
const data = localStorage.getItem('pos-data');
console.log(JSON.stringify(JSON.parse(data), null, 2));
```

## 📞 Support

For PostgreSQL-specific issues:
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Community Support: https://www.postgresql.org/support/
- Stack Overflow: Tag your questions with `postgresql`

For application-specific issues:
- Check the application logs
- Verify database connections
- Review migration scripts

---

## 🎯 Next Steps

After successful setup:
1. **Test all features** with PostgreSQL backend
2. **Configure backups** for production
3. **Set up monitoring** and alerts
4. **Optimize performance** based on usage patterns
5. **Plan for scaling** as your business grows

Your enhanced POS system is now ready with PostgreSQL for production use!
