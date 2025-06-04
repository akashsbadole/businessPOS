# businessPOS - Point of Sale System for Indian Small Businesses

businessPOS is a comprehensive point of sale system designed specifically for small businesses in India. It includes GST compliance, inventory management, customer tracking, and detailed reporting features.

![businessPOS Screenshot](https://img.heroui.chat/image/dashboard?w=1200&h=600&u=pos)

## Features

### Core POS Functionality

- **Intuitive Sales Interface**: User-friendly interface for quick sales processing
- **Product Catalog Management**: Easily manage your product inventory with barcode support
- **Multiple Payment Methods**: Support for Cash, UPI, Cards, and Digital Wallets
- **Receipt Generation**: Thermal printer compatible receipts with GST breakdown
- **Offline Mode**: Continue operations even without internet connection
- **Keyboard Shortcuts**: Efficient operations with keyboard shortcuts for common actions

### India-Specific Features

- **GST Compliance**: Automatic GST calculation (CGST, SGST, IGST)
- **HSN Code Management**: Track HSN codes for all products
- **GSTR-1 & GSTR-3B Reports**: Generate ready-to-file GST reports
- **Multi-language Support**: Interface in English, Hindi, and regional languages
- **Invoice Customization**: Customize invoices with your business details

### Inventory Management

- **Stock Tracking**: Real-time inventory tracking with low-stock alerts
- **Batch & Expiry Tracking**: Track product batches and expiry dates
- **Purchase Orders**: Create and manage purchase orders
- **Stock Adjustments**: Easy stock adjustment with reason tracking
- **Barcode Generation**: Generate and print barcodes for products

### Customer Management

- **Customer Database**: Store customer details and purchase history
- **Loyalty Program**: Implement points-based loyalty programs
- **Credit Management**: Track customer credit and pending payments
- **Customer Analytics**: Understand buying patterns and preferences

### Reporting & Analytics

- **Sales Reports**: Daily, weekly, monthly, and custom period reports
- **Inventory Reports**: Stock levels, movement, and valuation reports
- **GST Reports**: GSTR-1, GSTR-3B, and HSN summary reports
- **Profit Analysis**: Track profit margins by product and category
- **Visual Dashboard**: Visual representation of key business metrics

### Security & User Management

- **Role-Based Access**: Define roles with specific permissions
- **Audit Trails**: Track all system activities with user details
- **Secure Authentication**: Password protection and secure login
- **Data Backup**: Automatic and manual backup options

### Hardware Integration

- **Thermal Printers**: Support for standard 80mm thermal receipt printers
- **Barcode Scanners**: Compatible with USB and Bluetooth scanners
- **Cash Drawers**: Automatic cash drawer opening on sale completion
- **Display Screens**: Customer-facing display support

## Technical Architecture

- **Frontend**: React.js with HeroUI components and TailwindCSS
- **Database**: Turso SQLite with cloud sync capabilities
- **State Management**: Zustand for efficient state management
- **Offline Support**: IndexedDB for local data storage
- **Printing**: Browser-based printing with thermal printer support

## 🎯 **Function Key Shortcuts**

The POS system includes comprehensive keyboard shortcuts for efficient operations:

- **F2**: Change Quantity - Modify item quantity in cart
- **F3**: Item Discount - Apply discount to selected item
- **F4**: Remove Item - Remove selected item from cart
- **F7**: Bill Tax - Apply tax to entire bill
- **F9**: Bill Discount - Apply discount to entire bill
- **F10**: Loyalty Points - Access loyalty points features
- **F12**: Remarks - Add remarks to the bill
- **Ctrl+F**: Product Search - Open product search dialog
- **Ctrl+T**: New Bill - Start a new transaction
- **Ctrl+P**: Process Payment - Complete the transaction
- **Ctrl+B**: Partial Payment - Handle partial payments
- **Ctrl+M**: Multi Payment - Multiple payment methods
- **Escape**: Cancel/Close - Close dialogs and cancel operations

## 🔐 **Security Features**

- **Data Encryption**: All sensitive data encrypted at rest
- **Secure Authentication**: JWT-based user authentication
- **Role-based Access**: Granular permission system
- **Audit Logging**: Complete transaction audit trail
- **Backup & Recovery**: Automated daily backups
- **HTTPS Only**: Secure data transmission

## 📱 **Mobile Optimization**

The application is fully responsive and optimized for:
- **Android Tablets** (recommended for POS operations)
- **iPads** and iOS devices
- **Mobile phones** (for basic operations)
- **Desktop computers** (full feature access)

### **Recommended Hardware**
- **Tablet**: 10-inch Android tablet with 4GB RAM
- **Printer**: Thermal receipt printer with USB/Bluetooth
- **Scanner**: USB or Bluetooth barcode scanner
- **Cash Drawer**: Compatible with thermal printer

## 🛠️ **Installation & Setup**

### **Prerequisites**
- Node.js (v18.0 or higher)
- npm or yarn package manager
- Git for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

### **Quick Start**
```bash
# Clone the repository
git clone https://github.com/yourusername/businesspos.git
cd businesspos

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### **Environment Configuration**
Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL="your_turso_database_url"
TURSO_AUTH_TOKEN="your_turso_auth_token"

# Application Configuration
VITE_APP_NAME="BusinessPOS"
VITE_APP_VERSION="1.0.0"
VITE_API_BASE_URL="http://localhost:3000/api"

# Payment Gateway Configuration (Optional)
VITE_UPI_MERCHANT_ID="your_upi_merchant_id"
VITE_PAYMENT_GATEWAY_KEY="your_payment_gateway_key"

# WhatsApp Integration (Optional)
VITE_WHATSAPP_API_KEY="your_whatsapp_api_key"
```

## 🚀 **Deployment**

### **Production Build**
```bash
npm run build
```

### **Deploy to Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### **Deploy to Netlify**
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables

### **Deploy to Your Own Server**
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure SSL certificate for HTTPS

## 📊 **Database Schema**

### **Core Tables**
```sql
-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price REAL NOT NULL,
  cost REAL,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  hsn TEXT,
  tax_rate REAL DEFAULT 18,
  barcode TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  gstin TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent REAL DEFAULT 0,
  loyalty_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze',
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id TEXT,
  total REAL NOT NULL,
  subtotal REAL NOT NULL,
  tax_amount REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'paid',
  amount_received REAL DEFAULT 0,
  change_amount REAL DEFAULT 0,
  pending_amount REAL DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);
```

## 🆘 **Support & Documentation**

### **Getting Help**
- **Documentation**: Comprehensive user guides available
- **Video Tutorials**: Step-by-step setup and usage videos
- **Community Forum**: Connect with other users
- **Email Support**: Direct support for technical issues

### **Common Issues**
1. **Database Connection**: Check your Turso credentials
2. **Payment Gateway**: Verify API keys and configuration
3. **Printer Issues**: Ensure proper driver installation
4. **Mobile Access**: Use HTTPS for mobile device access

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📞 **Contact**

- **Website**: [businesspos.com](https://businesspos.com)
- **Email**: support@businesspos.com
- **Phone**: +91 9333 911 911
- **Address**: Mumbai, Maharashtra, India

---

**Built with ❤️ for Indian Small Businesses**

*Empowering entrepreneurs with modern technology while respecting traditional business practices.*

## Deployment Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/vyapar-pos.git
   cd vyapar-pos
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up the database**

   ```bash
   npx drizzle-kit generate:sqlite
   npx drizzle-kit push:sqlite
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**

   ```bash
   npm run build
   # or
   yarn build
   ```

6. **Deploy the build**
   - The built files will be in the `dist` directory
   - You can serve these files using any static file server

### Deployment Options

#### Option 1: Local Server

For a standalone local deployment (e.g., on a store computer):

```bash
npm run build
npx serve -s dist
```

#### Option 2: Cloud Hosting

Deploy to services like Vercel, Netlify, or AWS Amplify:

**Vercel**

```bash
npm install -g vercel
vercel login
vercel
```

**Netlify**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### Option 3: Docker Deployment

```bash
# Build the Docker image
docker build -t vyapar-pos .

# Run the container
docker run -p 8080:80 vyapar-pos
```

### Hardware Setup

1. **Thermal Printer Configuration**

   - Connect your thermal printer to your computer
   - Ensure it's set as the default printer or configure in settings
   - Test printing from the POS settings page

2. **Barcode Scanner Setup**

   - Most USB barcode scanners work as keyboard input devices
   - For Bluetooth scanners, pair with your device before using
   - Test scanning in the product search field

3. **Cash Drawer Connection**
   - Connect cash drawer to the receipt printer (RJ11 connection)
   - Enable cash drawer kicks in the hardware settings
   - Test opening from the POS interface

## System Requirements

- **Browser**: Chrome 80+, Firefox 72+, Edge 80+, Safari 13.1+
- **OS**: Windows 10+, macOS 10.14+, Ubuntu 18.04+
- **Processor**: Dual-core 2GHz or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 1GB free space minimum
- **Internet**: Required for initial setup and cloud sync (offline mode available after setup)

## Support & Troubleshooting

For support, please contact:

- Email: support@businessPOS.com
- Phone: (+91) 9333 911 911 | (+91) 6366827420

Common troubleshooting steps:

1. Clear browser cache and cookies
2. Restart the application
3. Check printer connection and settings
4. Verify internet connection for cloud features
5. Check for software updates

## License

This software is licensed under the [MIT License](LICENSE).

---

© 2024 businessPOS. All rights reserved.
