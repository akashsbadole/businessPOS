import {
  Subscription,
  License,
  PaymentRequest,
  SubscriptionValidation,
  SubscriptionPlan,
} from "../types/subscription";

export class SubscriptionService {
  private static readonly STORAGE_KEY = "pos_subscription";
  private static readonly LICENSE_KEY = "pos_license";

  // Subscription plans configuration
  static getSubscriptionPlans(): SubscriptionPlan[] {
    return [
      {
        id: "basic",
        name: "Basic Plan",
        type: "basic",
        description: "Perfect for small businesses",
        features: [
          "Up to 2 users",
          "Up to 1000 products",
          "Up to 5000 transactions/month",
          "Basic reports",
          "Email support",
          "Mobile responsive",
        ],
        monthlyPrice: 999, // INR
        yearlyPrice: 9999, // INR (2 months free)
        maxUsers: 2,
        maxProducts: 1000,
        maxTransactions: 5000,
      },
      {
        id: "premium",
        name: "Premium Plan",
        type: "premium",
        description: "Best for growing businesses",
        features: [
          "Up to 10 users",
          "Unlimited products",
          "Unlimited transactions",
          "Advanced reports & analytics",
          "Priority support",
          "Custom invoice templates",
          "Inventory management",
          "Customer management",
          "Supplier management",
        ],
        monthlyPrice: 2999, // INR
        yearlyPrice: 29999, // INR (2 months free)
        maxUsers: 10,
        maxProducts: -1, // Unlimited
        maxTransactions: -1, // Unlimited
        popular: true,
      },
      {
        id: "enterprise",
        name: "Enterprise Plan",
        type: "enterprise",
        description: "For large businesses",
        features: [
          "Unlimited users",
          "Unlimited products",
          "Unlimited transactions",
          "Advanced analytics",
          "Multi-location support",
          "API access",
          "Custom integrations",
          "24/7 phone support",
          "Dedicated account manager",
          "Custom training",
        ],
        monthlyPrice: 9999, // INR
        yearlyPrice: 99999, // INR (2 months free)
        maxUsers: -1, // Unlimited
        maxProducts: -1, // Unlimited
        maxTransactions: -1, // Unlimited
      },
    ];
  }

  // Generate license key
  static generateLicenseKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segments = [];

    for (let i = 0; i < 4; i++) {
      let segment = "";
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }

    return segments.join("-");
  }

  // Validate subscription
  static async validateSubscription(): Promise<SubscriptionValidation> {
    try {
      const storedSubscription = localStorage.getItem(this.STORAGE_KEY);
      const storedLicense = localStorage.getItem(this.LICENSE_KEY);

      if (!storedSubscription || !storedLicense) {
        return {
          isValid: false,
          message: "No active subscription found",
          redirectToPayment: true,
        };
      }

      const subscription: Subscription = JSON.parse(storedSubscription);
      const license: License = JSON.parse(storedLicense);

      const now = new Date();
      const endDate = new Date(subscription.endDate);
      const daysRemaining = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (subscription.status !== "active" || !license.isActive) {
        return {
          isValid: false,
          subscription,
          license,
          message: "Subscription is not active",
          redirectToPayment: true,
        };
      }

      if (endDate < now) {
        return {
          isValid: false,
          subscription,
          license,
          daysRemaining: 0,
          message: "Subscription has expired",
          redirectToPayment: true,
        };
      }

      if (daysRemaining <= 7) {
        return {
          isValid: true,
          subscription,
          license,
          daysRemaining,
          message: `Subscription expires in ${daysRemaining} days`,
        };
      }

      return {
        isValid: true,
        subscription,
        license,
        daysRemaining,
        message: "Subscription is active",
      };
    } catch (error) {
      console.error("Error validating subscription:", error);
      return {
        isValid: false,
        message: "Error validating subscription",
        redirectToPayment: true,
      };
    }
  }

  // Create subscription after payment
  static async createSubscription(
    paymentRequest: PaymentRequest
  ): Promise<{ subscription: Subscription; license: License }> {
    const plans = this.getSubscriptionPlans();
    const plan = plans.find((p) => p.type === paymentRequest.planType);

    if (!plan) {
      throw new Error("Invalid plan type");
    }

    const now = new Date();
    const endDate = new Date();

    if (paymentRequest.duration === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      userId: `user_${Date.now()}`,
      planType: paymentRequest.planType,
      status: "active",
      startDate: now,
      endDate,
      paymentMethod: paymentRequest.paymentMethod,
      transactionId: paymentRequest.transactionId,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      features: plan.features,
      maxUsers: plan.maxUsers,
      maxProducts: plan.maxProducts,
      maxTransactions: plan.maxTransactions,
      createdAt: now,
      updatedAt: now,
    };

    const license: License = {
      id: `lic_${Date.now()}`,
      licenseKey: this.generateLicenseKey(),
      subscriptionId: subscription.id,
      userId: subscription.userId,
      isActive: true,
      activatedAt: now,
      expiresAt: endDate,
      createdAt: now,
      updatedAt: now,
    };

    // Store in localStorage (in production, this would be stored in database)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(subscription));
    localStorage.setItem(this.LICENSE_KEY, JSON.stringify(license));

    return { subscription, license };
  }

  // Get current subscription
  static getCurrentSubscription(): Subscription | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Get current license
  static getCurrentLicense(): License | null {
    try {
      const stored = localStorage.getItem(this.LICENSE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Clear subscription (for testing)
  static clearSubscription(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.LICENSE_KEY);
  }

  // Activate license with key
  static async activateLicense(licenseKey: string): Promise<boolean> {
    // In production, this would validate against a server
    // For demo, we'll create a basic subscription
    try {
      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month trial

      const subscription: Subscription = {
        id: `sub_${Date.now()}`,
        userId: `user_${Date.now()}`,
        planType: "basic",
        status: "active",
        startDate: now,
        endDate,
        paymentMethod: "upi",
        amount: 999,
        currency: "INR",
        features: this.getSubscriptionPlans()[0].features,
        maxUsers: 2,
        maxProducts: 1000,
        maxTransactions: 5000,
        createdAt: now,
        updatedAt: now,
      };

      const license: License = {
        id: `lic_${Date.now()}`,
        licenseKey,
        subscriptionId: subscription.id,
        userId: subscription.userId,
        isActive: true,
        activatedAt: now,
        expiresAt: endDate,
        createdAt: now,
        updatedAt: now,
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(subscription));
      localStorage.setItem(this.LICENSE_KEY, JSON.stringify(license));

      return true;
    } catch {
      return false;
    }
  }

  // Get UPI payment details
  static getUPIPaymentDetails(amount: number, reference: string) {
    return {
      upiId: "businesspos@paytm", // Replace with your actual UPI ID
      qrCode: `upi://pay?pa=businesspos@paytm&pn=BusinessPOS&am=${amount}&cu=INR&tn=POS_Subscription_${reference}`,
      amount,
      reference,
      instructions: [
        "Scan the QR code with any UPI app",
        "Or pay directly to UPI ID: businesspos@paytm",
        "Use reference: " + reference,
        "Send screenshot of payment to support email",
        "Include your email address in the payment note",
      ],
    };
  }

  // Contact information
  static getContactInfo() {
    return {
      email: "support@businesspos.com",
      phone: "+91-9876543210",
      whatsapp: "+91-9876543210",
      telegram: "@businesspos_support",
      supportHours: "9 AM - 6 PM IST (Monday to Friday)",
    };
  }
}
