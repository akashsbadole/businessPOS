import { tursoClient } from './turso-database';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier' | 'inventory';
  permissions: string[];
  status: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'cashier' | 'inventory';
  permissions: string[];
}

/**
 * User Service
 * Manages user authentication and user data
 */
export class UserService {
  // Create a new user
  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();
    
    const user = {
      id,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await tursoClient.execute(`
        INSERT INTO users (
          id, name, email, password_hash, role, permissions, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        user.id,
        user.name,
        user.email,
        'hashed_password', // In real app, hash the password
        user.role,
        JSON.stringify(user.permissions),
        user.status,
        now,
        now
      ]);

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await tursoClient.execute(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user');
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    try {
      const result = await tursoClient.execute(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Failed to fetch user');
    }
  }

  // Get all users
  static async getAllUsers(): Promise<User[]> {
    try {
      const result = await tursoClient.execute(
        'SELECT * FROM users ORDER BY created_at DESC'
      );

      return result.rows.map((row: any) => this.mapRowToUser(row));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  // Initialize default users
  static async initializeDefaultUsers(): Promise<void> {
    try {
      // Check if admin user already exists
      const existingAdmin = await this.getUserByEmail('admin@pos.com');
      if (existingAdmin) {
        console.log('Default admin user already exists');
        return;
      }

      // Create default admin user
      const adminUser: Omit<User, 'id'> = {
        name: 'Admin User',
        email: 'admin@pos.com',
        role: 'admin',
        permissions: [
          'pos_access',
          'inventory_management',
          'customer_management',
          'supplier_management',
          'purchase_orders',
          'invoice_templates',
          'reports',
          'settings',
          'user_management'
        ],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.createUser(adminUser);
      console.log('Default admin user created successfully');

      // Create default cashier user
      const cashierUser: Omit<User, 'id'> = {
        name: 'Cashier User',
        email: 'cashier@pos.com',
        role: 'cashier',
        permissions: [
          'pos_access',
          'customer_management'
        ],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.createUser(cashierUser);
      console.log('Default cashier user created successfully');

    } catch (error) {
      console.error('Error initializing default users:', error);
      throw error;
    }
  }

  // Map database row to User object
  private static mapRowToUser(row: any): User {
    return {
      id: row.id as string,
      name: row.name as string,
      email: row.email as string,
      role: row.role as 'admin' | 'manager' | 'cashier' | 'inventory',
      permissions: row.permissions ? JSON.parse(row.permissions as string) : [],
      status: row.status as 'active' | 'inactive',
      lastLogin: row.last_login ? new Date(row.last_login as string) : undefined,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  // Update user
  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const now = new Date().toISOString();
      
      await tursoClient.execute(`
        UPDATE users SET
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          role = COALESCE(?, role),
          permissions = COALESCE(?, permissions),
          status = COALESCE(?, status),
          updated_at = ?
        WHERE id = ?
      `, [
        userData.name || null,
        userData.email || null,
        userData.role || null,
        userData.permissions ? JSON.stringify(userData.permissions) : null,
        userData.status || null,
        now,
        id
      ]);

      const updatedUser = await this.getUserById(id);
      if (!updatedUser) {
        throw new Error('User not found after update');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  // Delete user
  static async deleteUser(id: string): Promise<void> {
    try {
      await tursoClient.execute('DELETE FROM users WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  // Authenticate user (simplified for demo)
  static async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      // In a real app, you would hash the password and compare
      const user = await this.getUserByEmail(email);
      
      if (!user || user.status !== 'active') {
        return null;
      }

      // Update last login
      await tursoClient.execute(
        'UPDATE users SET last_login = ? WHERE id = ?',
        [new Date().toISOString(), user.id]
      );

      return user;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }
}
