# Enhanced businessPOS - Setup Guide

This guide will help you set up the enhanced businessPOS system with all the new features and capabilities.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vyapar-pos
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**

   ```bash
   npx drizzle-kit generate

   ```

   ```
   npx drizzle-kit migrate


   ```

   This command will:

   - Generate the database schema
   - Create the SQLite database
   - Run migrations to populate sample data

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## 📊 Database Schema

The enhanced system includes the following tables:

### Core Tables

- **products** - Product catalog with enhanced fields
- **categories** - Hierarchical category system
- **customers** - Customer management with loyalty support
- **suppliers** - Supplier database
- **invoices** - Sales transactions
- **invoice_items** - Line items for invoices

### New Enhanced Tables

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

## 🛠 Configuration

### Business Settings

After setup, configure your business details:

1. Navigate to Settings → Business Settings
2. Update the following:
   - Business Name
   - Address and Contact Details
   - GST Information (GSTIN, PAN)
   - Tax Rates (CGST, SGST, IGST)
   - Invoice Prefix
   - Currency Symbol

### Payment Methods

Configure payment methods in Settings → Payment Methods:

- Cash
- UPI (PhonePe, Google Pay, Paytm)
- Credit/Debit Cards
- Bank Transfer
- Digital Wallets

### Invoice Templates

Customize invoice templates in Settings → Invoice Templates:

- Standard A4 format
- Thermal receipt format
- Minimal format
- Custom branded templates

## 📱 Features Overview

### Dashboard

- Real-time business metrics
- Sales analytics with charts
- Low stock alerts
- Quick action buttons
- Performance indicators

### Point of Sale (POS)

- Fast product search and barcode scanning
- Shopping cart with quantity adjustments
- Multiple payment methods
- GST calculations
- Customer selection
- Discount application
- Invoice generation and printing

### Inventory Management

- Product catalog with categories
- Stock tracking and alerts
- Barcode management
- Supplier information
- Purchase order creation
- Stock adjustments
- Inventory valuation

### Customer Management

- Customer database
- Purchase history
- Loyalty program with tiers
- Points earning and redemption
- Customer analytics
- Communication tools

### Supplier Management

- Supplier database
- Contact information
- Payment terms and credit limits
- Purchase order tracking
- Performance monitoring

### Purchase Orders

- Create and manage POs
- Multi-item orders
- Receiving management
- Cost tracking
- Supplier communication

### Expense Management

- Track business expenses
- Categorize expenses
- Receipt management
- Expense reporting
- Budget monitoring

### Reports & Analytics

- Sales reports (daily, weekly, monthly)
- Inventory reports
- Customer analytics
- GST reports
- Profit analysis
- Expense reports

### Staff Management

- Employee profiles
- Attendance tracking
- Role-based permissions
- Performance monitoring

## 🔧 Advanced Configuration

### Database Customization

To modify the database schema:

1. Edit `src/db/schema.ts`
2. Generate new migration:
   ```bash
   npm run db:generate
   ```
3. Apply changes:
   ```bash
   npm run db:push
   ```

### Adding Custom Fields

To add custom fields to existing tables:

1. Update the schema in `src/db/schema.ts`
2. Update TypeScript interfaces in `src/types/pos.ts`
3. Update service classes in `src/services/database.ts`
4. Update UI components as needed

### Custom Reports

To create custom reports:

1. Create new service methods in `src/services/database.ts`
2. Create report components in `src/components/reports/`
3. Add routes in `src/App.tsx`

## 🖨 Printing Setup

### Thermal Printer Configuration

1. Connect your thermal printer via USB
2. Install printer drivers if required
3. Set as default printer or configure in settings
4. Test printing from POS settings

### Receipt Customization

Customize receipt templates in:

- `src/components/pos/enhanced-invoice.tsx`
- Modify thermal receipt layout
- Add/remove fields as needed
- Update business branding

## 📱 Mobile & Tablet Support

The system is fully responsive and works on:

- Desktop computers
- Tablets (iPad, Android tablets)
- Mobile phones (for management tasks)

### Recommended Devices

- **POS Terminal**: Desktop/laptop with external monitor
- **Management**: Tablet for inventory and customer management
- **Mobile**: Phone for quick checks and notifications

## 🔐 Security & Backup

### User Management

- Create user accounts with specific roles
- Set permissions for different functions
- Monitor user activity through audit logs

### Data Backup

- Automatic local database backup
- Export data to CSV/Excel
- Cloud sync capabilities (future feature)

### Security Best Practices

- Regular password updates
- Limited user permissions
- Secure network connections
- Regular software updates

## 🚀 Performance Optimization

### Database Optimization

- Regular database maintenance
- Index optimization for large datasets
- Archiving old transactions

### Application Performance

- Clear browser cache regularly
- Close unused browser tabs
- Restart application periodically
- Monitor system resources

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**

```bash
# Recreate database
rm pos.db
npm run db:setup
```

**Print Issues**

- Check printer connection
- Verify printer drivers
- Test with system print dialog
- Check paper and ink levels

**Performance Issues**

- Clear browser cache
- Restart application
- Check available disk space
- Close other applications

**Data Sync Issues**

- Check internet connection
- Verify database integrity
- Restart application

### Getting Help

- Check the documentation
- Review error messages
- Contact support team
- Submit bug reports

## 📞 Support

For technical support:

- Email: support@businessPOS.com
- Phone: (+91) 9333 911 911 | (+91) 6366827420
- Documentation: Check ENHANCED_FEATURES.md
- Issues: Create GitHub issues for bugs

## 🔄 Updates & Maintenance

### Regular Maintenance

- Weekly: Clear cache and temporary files
- Monthly: Database optimization
- Quarterly: Full system backup
- Annually: Hardware maintenance

### Software Updates

- Check for updates regularly
- Test updates in development environment
- Backup data before major updates
- Follow update instructions carefully

---

## 🎯 Next Steps

After setup:

1. Configure business settings
2. Add your products and categories
3. Set up suppliers and customers
4. Create user accounts for staff
5. Test all features thoroughly
6. Train staff on system usage
7. Go live with confidence!

For advanced features and customization, refer to the ENHANCED_FEATURES.md documentation.
