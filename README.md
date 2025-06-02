# VyaparPOS - Point of Sale System for Indian Small Businesses

VyaparPOS is a comprehensive point of sale system designed specifically for small businesses in India. It includes GST compliance, inventory management, customer tracking, and detailed reporting features.

![VyaparPOS Screenshot](https://img.heroui.chat/image/dashboard?w=1200&h=600&u=pos)

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
- **Database**: SQLite with Drizzle ORM for data management
- **State Management**: React Context API and hooks
- **Offline Support**: IndexedDB for local data storage
- **Printing**: Browser-based printing with thermal printer support

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
- Email: support@vyaparpos.com
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

© 2024 VyaparPOS. All rights reserved.
