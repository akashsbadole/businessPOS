# 🗄️ Database Setup Guide

## 📋 Overview

This guide will help you set up your Turso database and push the schema for your POS system.

## 🚀 Quick Setup

### **Step 1: Set up Turso Account**

1. **Sign up for Turso**: Go to [turso.tech](https://turso.tech) and create an account
2. **Install Turso CLI**: 
   ```bash
   # On Windows (using PowerShell)
   iwr -useb https://get.turso.tech/install.ps1 | iex
   
   # On macOS/Linux
   curl -sSfL https://get.turso.tech/install.sh | bash
   ```

3. **Login to Turso**:
   ```bash
   turso auth login
   ```

### **Step 2: Create Database**

1. **Create a new database**:
   ```bash
   turso db create pos-system-india
   ```

2. **Get database URL**:
   ```bash
   turso db show pos-system-india --url
   ```

3. **Create authentication token**:
   ```bash
   turso db tokens create pos-system-india
   ```

### **Step 3: Configure Environment**

1. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your Turso credentials**:
   ```env
   # Turso Database Configuration
   VITE_TURSO_DATABASE_URL=libsql://pos-system-india-[your-username].turso.io
   VITE_TURSO_AUTH_TOKEN=your_actual_auth_token_here
   
   # Drizzle Kit Configuration
   TURSO_DATABASE_URL=libsql://pos-system-india-[your-username].turso.io
   TURSO_AUTH_TOKEN=your_actual_auth_token_here
   ```

### **Step 4: Push Database Schema**

1. **Generate migration files**:
   ```bash
   npm run db:generate
   ```

2. **Push schema to Turso**:
   ```bash
   npm run db:push
   ```

3. **Verify schema** (optional):
   ```bash
   npm run db:studio
   ```

### **Step 5: Load Dummy Data**

1. **Using the Dashboard UI** (Recommended):
   - Start your development server: `npm run dev`
   - Navigate to Dashboard → Admin Tools
   - Click "Load Dummy Data"

2. **Using Command Line**:
   ```bash
   npm run load-dummy-data
   ```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate migration files from schema |
| `npm run db:push` | Push schema changes to database |
| `npm run db:pull` | Pull schema from database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run load-dummy-data` | Load sample data via script |

## 📊 Database Schema

Your database will include these tables:

- **categories** - Product categories
- **suppliers** - Supplier information
- **products** - Product catalog with inventory
- **customers** - Customer database
- **transactions** - Sales transactions
- **invoice_items** - Detailed transaction items
- **store_settings** - Store configuration

## 🔧 Troubleshooting

### **Error: "No config path provided"**
- Make sure you have a `.env` file with Turso credentials
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set

### **Error: "drizzle-orm not found"**
- Run: `npm install`
- Verify `drizzle-orm` is in your `package.json`

### **Error: "Authentication failed"**
- Check your auth token is correct
- Try creating a new token: `turso db tokens create pos-system-india`

### **Error: "Database not found"**
- Verify database exists: `turso db list`
- Check database URL is correct

## 🎯 Next Steps

After successful setup:

1. **✅ Start development server**: `npm run dev`
2. **✅ Load dummy data**: Use Dashboard → Admin Tools
3. **✅ Test POS features**: Create transactions, manage inventory
4. **✅ Customize data**: Add your own products and customers

## 🔒 Security Notes

- **Never commit `.env` file** to version control
- **Rotate auth tokens** regularly in production
- **Use different databases** for development and production
- **Backup your data** regularly

## 📈 Production Deployment

For production deployment:

1. **Create production database**:
   ```bash
   turso db create pos-system-prod
   ```

2. **Set production environment variables**
3. **Run migrations**: `npm run db:push`
4. **Deploy your application**

---

**🎉 Your POS system database is ready!**
