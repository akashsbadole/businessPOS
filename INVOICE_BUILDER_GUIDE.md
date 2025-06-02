# 🎨 Invoice Builder - Drag & Drop Template Designer

## 🌟 Overview

The Invoice Builder is a powerful drag-and-drop template designer that allows authorized users to create custom invoice templates with complete visual control. Built with modern React technologies and role-based access control.

## ✨ Features

### 🔐 **Authentication & Authorization**
- **Role-Based Access**: Only users with `invoice_templates` permission can access
- **Secure Login**: Enhanced authentication with demo credentials
- **User Management**: Admin, Manager, and Cashier roles with different permissions

### 🎯 **Drag & Drop Builder**
- **Visual Designer**: Intuitive drag-and-drop interface
- **Live Preview**: Real-time preview with sample data
- **Element Library**: Rich set of pre-built components
- **Responsive Canvas**: Supports multiple paper sizes and orientations

### 🧩 **Template Elements**

#### **Basic Elements**
- **Text**: Customizable text with fonts, colors, alignment
- **Image/Logo**: Upload and position business logos
- **Line**: Horizontal/vertical lines for separation

#### **Data Elements**
- **Business Info**: Company details (name, address, contact)
- **Customer Info**: Bill-to information
- **Items Table**: Product/service line items
- **Totals**: Subtotal, tax, discount, total calculations

#### **Special Elements**
- **QR Code**: Dynamic QR codes for invoices
- **Barcode**: Various barcode formats
- **Footer**: Custom footer text and terms

### 🎨 **Styling Options**
- **Typography**: Font size, weight, alignment, color
- **Layout**: Position, size, margins, padding
- **Borders**: Width, color, style for tables
- **Colors**: Text and background colors
- **Visibility**: Show/hide elements conditionally

### 📄 **Template Management**
- **Multiple Templates**: Create unlimited custom templates
- **Categories**: Invoice, Receipt, Estimate, Custom
- **Paper Sizes**: A4, A5, Thermal 80mm, Thermal 58mm
- **Orientations**: Portrait and Landscape
- **Version Control**: Track template versions
- **Default Templates**: Set default templates per category

## 🚀 Getting Started

### 1. **Login with Authorized User**
```
Admin: admin@pos.com / password
Manager: manager@pos.com / password
```

### 2. **Navigate to Invoice Templates**
- Click "Invoice Templates" in the main navigation
- View existing templates or create new ones

### 3. **Create New Template**
- Click "Create Template" button
- Choose template settings (name, category, paper size)
- Start designing with drag-and-drop

### 4. **Design Your Template**
- **Drag Elements**: From toolbox to canvas
- **Position**: Click and drag to move elements
- **Resize**: Use resize handles on selected elements
- **Style**: Use properties panel to customize appearance
- **Preview**: Switch to preview mode to see final result

### 5. **Save and Use**
- Save your template
- Set as default if needed
- Use in POS system for invoice generation

## 🎯 **Demo Workflow**

### **Step 1: Authentication**
1. Open the application
2. Login with admin credentials: `admin@pos.com` / `password`
3. Navigate to "Invoice Templates" in the main menu

### **Step 2: Template Creation**
1. Click "Create Template"
2. Set template name: "My Custom Invoice"
3. Choose category: "Invoice"
4. Select paper size: "A4"
5. Set orientation: "Portrait"

### **Step 3: Design Process**
1. **Add Business Info**:
   - Drag "Business Info" from toolbox
   - Position at top-left of canvas
   - Customize in properties panel

2. **Add Customer Info**:
   - Drag "Customer Info" element
   - Position below business info
   - Adjust styling as needed

3. **Add Items Table**:
   - Drag "Items Table" to center
   - Resize to fit content
   - Customize border and font size

4. **Add Totals**:
   - Drag "Totals" element
   - Position at bottom-right
   - Set text alignment to right

5. **Add Logo**:
   - Drag "Image/Logo" element
   - Position at top-right
   - Resize appropriately

6. **Add Footer**:
   - Drag "Footer" element
   - Position at bottom
   - Add terms and conditions

### **Step 4: Styling**
1. Select each element
2. Use properties panel to:
   - Adjust font sizes
   - Change colors
   - Set alignment
   - Modify spacing

### **Step 5: Preview & Save**
1. Click "Preview" to see final result
2. Test with sample data
3. Make adjustments if needed
4. Click "Save Template"

## 🔧 **Technical Implementation**

### **Technologies Used**
- **React 18**: Modern React with hooks
- **@dnd-kit**: Drag and drop functionality
- **HeroUI**: UI component library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling

### **Key Components**
- `InvoiceBuilder`: Main builder interface
- `ElementToolbox`: Draggable element library
- `CanvasArea`: Design canvas with drop zone
- `DraggableInvoiceElement`: Individual template elements
- `PropertiesPanel`: Element styling controls
- `TemplatePreview`: Live preview with data

### **Authentication System**
- `AuthProvider`: Context-based authentication
- Role-based permissions
- Secure route protection
- Session management

## 🎨 **Customization Options**

### **Element Properties**
```typescript
interface InvoiceElement {
  id: string;
  type: 'text' | 'image' | 'table' | 'business-info' | ...;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  styles?: {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
    // ... more styling options
  };
  properties?: {
    // Element-specific properties
  };
}
```

### **Template Configuration**
```typescript
interface InvoiceTemplate {
  id: string;
  name: string;
  category: 'receipt' | 'invoice' | 'estimate' | 'custom';
  paperSize: 'A4' | 'A5' | 'thermal-80mm' | 'thermal-58mm';
  orientation: 'portrait' | 'landscape';
  elements: InvoiceElement[];
  // ... more configuration
}
```

## 🔒 **Security Features**

### **Access Control**
- Permission-based access to template builder
- Role-based feature restrictions
- Secure authentication flow

### **Data Validation**
- Template validation before saving
- Element property validation
- Type-safe operations

## 📱 **Responsive Design**
- Works on desktop, tablet, and mobile
- Touch-friendly drag and drop
- Responsive canvas scaling
- Mobile-optimized properties panel

## 🎯 **Use Cases**

### **Business Types**
- **Retail Stores**: Custom receipt templates
- **Service Providers**: Professional invoice layouts
- **Restaurants**: Thermal receipt designs
- **Freelancers**: Branded invoice templates

### **Template Types**
- **Sales Invoices**: Detailed product invoices
- **Service Bills**: Time-based billing
- **Receipts**: Simple transaction receipts
- **Estimates**: Quote templates
- **Custom**: Specialized business needs

## 🚀 **Future Enhancements**

### **Planned Features**
- **Template Marketplace**: Share and download templates
- **Advanced Elements**: Charts, signatures, custom fields
- **Conditional Logic**: Show/hide based on data
- **Multi-language**: Internationalization support
- **Export Options**: PDF, PNG, SVG export
- **Template Versioning**: Advanced version control

### **Integration Options**
- **Email Templates**: Use for email invoices
- **Print Integration**: Direct printer support
- **API Access**: Template management via API
- **Webhook Support**: Template change notifications

---

## 🎉 **Ready to Design!**

Your POS system now includes a powerful, professional-grade invoice template builder with:

✅ **Drag & Drop Interface**  
✅ **Role-Based Security**  
✅ **Live Preview**  
✅ **Multiple Paper Sizes**  
✅ **Rich Element Library**  
✅ **Professional Styling**  
✅ **Template Management**  

**Start creating beautiful, custom invoice templates today!** 🎨✨
