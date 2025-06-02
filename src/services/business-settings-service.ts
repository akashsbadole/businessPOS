import { tursoClient } from './turso-database';
import { BusinessSettings, BusinessSettingsFormData } from '../types/business-settings';

/**
 * Business Settings Service
 * Manages business information for invoice customization
 */
export class BusinessSettingsService {
  
  /**
   * Initialize business settings table
   */
  static async initializeTable(): Promise<void> {
    try {
      await tursoClient.execute(`
        CREATE TABLE IF NOT EXISTS business_settings (
          id TEXT PRIMARY KEY,
          business_name TEXT NOT NULL,
          business_type TEXT NOT NULL,
          tagline TEXT,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          website TEXT,
          address TEXT NOT NULL,
          city TEXT NOT NULL,
          state TEXT NOT NULL,
          zip_code TEXT NOT NULL,
          country TEXT NOT NULL,
          gst_number TEXT,
          pan_number TEXT,
          tax_id TEXT,
          bank_name TEXT,
          account_number TEXT,
          ifsc_code TEXT,
          upi_id TEXT,
          invoice_prefix TEXT NOT NULL DEFAULT 'INV',
          invoice_start_number INTEGER NOT NULL DEFAULT 1,
          currency TEXT NOT NULL DEFAULT 'INR',
          currency_symbol TEXT NOT NULL DEFAULT '₹',
          payment_terms TEXT NOT NULL DEFAULT 'Net 30 days',
          terms_and_conditions TEXT,
          notes TEXT,
          logo_url TEXT,
          primary_color TEXT NOT NULL DEFAULT '#2563eb',
          secondary_color TEXT NOT NULL DEFAULT '#64748b',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          created_by TEXT NOT NULL
        )
      `);
    } catch (error) {
      console.error('Error creating business_settings table:', error);
      throw error;
    }
  }

  /**
   * Get business settings (returns first/default settings)
   */
  static async getBusinessSettings(): Promise<BusinessSettings | null> {
    try {
      const result = await tursoClient.execute(
        'SELECT * FROM business_settings ORDER BY created_at ASC LIMIT 1'
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return this.mapRowToBusinessSettings(row);
    } catch (error) {
      console.error('Error getting business settings:', error);
      throw new Error('Failed to get business settings');
    }
  }

  /**
   * Create or update business settings
   */
  static async saveBusinessSettings(
    data: BusinessSettingsFormData,
    userId: string
  ): Promise<BusinessSettings> {
    try {
      // Check if settings already exist
      const existing = await this.getBusinessSettings();
      
      if (existing) {
        // Update existing settings
        await tursoClient.execute(`
          UPDATE business_settings SET
            business_name = ?,
            business_type = ?,
            tagline = ?,
            email = ?,
            phone = ?,
            website = ?,
            address = ?,
            city = ?,
            state = ?,
            zip_code = ?,
            country = ?,
            gst_number = ?,
            pan_number = ?,
            tax_id = ?,
            bank_name = ?,
            account_number = ?,
            ifsc_code = ?,
            upi_id = ?,
            invoice_prefix = ?,
            invoice_start_number = ?,
            currency = ?,
            currency_symbol = ?,
            payment_terms = ?,
            terms_and_conditions = ?,
            notes = ?,
            primary_color = ?,
            secondary_color = ?,
            updated_at = ?
          WHERE id = ?
        `, [
          data.businessName,
          data.businessType,
          data.tagline || null,
          data.email,
          data.phone,
          data.website || null,
          data.address,
          data.city,
          data.state,
          data.zipCode,
          data.country,
          data.gstNumber || null,
          data.panNumber || null,
          data.taxId || null,
          data.bankName || null,
          data.accountNumber || null,
          data.ifscCode || null,
          data.upiId || null,
          data.invoicePrefix,
          data.invoiceStartNumber,
          data.currency,
          data.currencySymbol,
          data.paymentTerms,
          data.termsAndConditions || null,
          data.notes || null,
          data.primaryColor,
          data.secondaryColor,
          new Date().toISOString(),
          existing.id
        ]);

        return await this.getBusinessSettings() as BusinessSettings;
      } else {
        // Create new settings
        const id = `bs_${Date.now()}`;
        await tursoClient.execute(`
          INSERT INTO business_settings (
            id, business_name, business_type, tagline, email, phone, website,
            address, city, state, zip_code, country, gst_number, pan_number,
            tax_id, bank_name, account_number, ifsc_code, upi_id,
            invoice_prefix, invoice_start_number, currency, currency_symbol,
            payment_terms, terms_and_conditions, notes, primary_color,
            secondary_color, created_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id,
          data.businessName,
          data.businessType,
          data.tagline || null,
          data.email,
          data.phone,
          data.website || null,
          data.address,
          data.city,
          data.state,
          data.zipCode,
          data.country,
          data.gstNumber || null,
          data.panNumber || null,
          data.taxId || null,
          data.bankName || null,
          data.accountNumber || null,
          data.ifscCode || null,
          data.upiId || null,
          data.invoicePrefix,
          data.invoiceStartNumber,
          data.currency,
          data.currencySymbol,
          data.paymentTerms,
          data.termsAndConditions || null,
          data.notes || null,
          data.primaryColor,
          data.secondaryColor,
          userId
        ]);

        return await this.getBusinessSettings() as BusinessSettings;
      }
    } catch (error) {
      console.error('Error saving business settings:', error);
      throw new Error('Failed to save business settings');
    }
  }

  /**
   * Get next invoice number
   */
  static async getNextInvoiceNumber(): Promise<string> {
    try {
      const settings = await this.getBusinessSettings();
      if (!settings) {
        return 'INV-001';
      }

      // Get the highest invoice number from transactions
      const result = await tursoClient.execute(
        'SELECT MAX(CAST(SUBSTR(invoiceNumber, LENGTH(?) + 2) AS INTEGER)) as max_num FROM transactions WHERE invoiceNumber LIKE ?',
        [settings.invoicePrefix, `${settings.invoicePrefix}-%`]
      );

      let nextNumber = settings.invoiceStartNumber;
      if (result.rows.length > 0 && result.rows[0].max_num) {
        nextNumber = (result.rows[0].max_num as number) + 1;
      }

      return `${settings.invoicePrefix}-${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Error getting next invoice number:', error);
      return 'INV-001';
    }
  }

  /**
   * Initialize default business settings
   */
  static async initializeDefaultSettings(userId: string): Promise<void> {
    try {
      const existing = await this.getBusinessSettings();
      if (existing) {
        return; // Settings already exist
      }

      const defaultData: BusinessSettingsFormData = {
        businessName: 'Your Business Name',
        businessType: 'Retail',
        tagline: 'Your Business Tagline',
        email: 'info@yourbusiness.com',
        phone: '+91 98765 43210',
        website: 'www.yourbusiness.com',
        address: '123 Business Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
        gstNumber: '',
        panNumber: '',
        taxId: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        invoicePrefix: 'INV',
        invoiceStartNumber: 1,
        currency: 'INR',
        currencySymbol: '₹',
        paymentTerms: 'Net 30 days',
        termsAndConditions: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
        notes: 'Thank you for your business!',
        primaryColor: '#2563eb',
        secondaryColor: '#64748b',
      };

      await this.saveBusinessSettings(defaultData, userId);
    } catch (error) {
      console.error('Error initializing default business settings:', error);
      throw error;
    }
  }

  /**
   * Map database row to BusinessSettings object
   */
  private static mapRowToBusinessSettings(row: any): BusinessSettings {
    return {
      id: row.id as string,
      businessName: row.business_name as string,
      businessType: row.business_type as string,
      tagline: row.tagline as string,
      email: row.email as string,
      phone: row.phone as string,
      website: row.website as string,
      address: row.address as string,
      city: row.city as string,
      state: row.state as string,
      zipCode: row.zip_code as string,
      country: row.country as string,
      gstNumber: row.gst_number as string,
      panNumber: row.pan_number as string,
      taxId: row.tax_id as string,
      bankName: row.bank_name as string,
      accountNumber: row.account_number as string,
      ifscCode: row.ifsc_code as string,
      upiId: row.upi_id as string,
      invoicePrefix: row.invoice_prefix as string,
      invoiceStartNumber: row.invoice_start_number as number,
      currency: row.currency as string,
      currencySymbol: row.currency_symbol as string,
      paymentTerms: row.payment_terms as string,
      termsAndConditions: row.terms_and_conditions as string,
      notes: row.notes as string,
      logoUrl: row.logo_url as string,
      primaryColor: row.primary_color as string,
      secondaryColor: row.secondary_color as string,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
      createdBy: row.created_by as string,
    };
  }
}
