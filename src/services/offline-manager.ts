import { openDB, DBSchema, IDBPDatabase } from 'idb';

// IndexedDB Schema
interface OfflineDB extends DBSchema {
  products: {
    key: string;
    value: any;
  };
  customers: {
    key: string;
    value: any;
  };
  transactions: {
    key: string;
    value: any;
  };
  pending_sync: {
    key: string;
    value: {
      id: string;
      type: 'create' | 'update' | 'delete';
      table: string;
      data: any;
      timestamp: number;
    };
  };
  settings: {
    key: string;
    value: any;
  };
}

class OfflineManager {
  private db: IDBPDatabase<OfflineDB> | null = null;
  private isOnline = navigator.onLine;
  private syncQueue: Array<any> = [];
  private syncInProgress = false;

  async initialize() {
    try {
      this.db = await openDB<OfflineDB>('BusinessPOS_Offline', 1, {
        upgrade(db) {
          // Create object stores
          if (!db.objectStoreNames.contains('products')) {
            db.createObjectStore('products', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('customers')) {
            db.createObjectStore('customers', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('transactions')) {
            db.createObjectStore('transactions', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('pending_sync')) {
            db.createObjectStore('pending_sync', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
        },
      });

      // Set up online/offline event listeners
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));

      console.log('Offline manager initialized');
    } catch (error) {
      console.error('Failed to initialize offline manager:', error);
    }
  }

  private handleOnline() {
    this.isOnline = true;
    console.log('App is online - starting sync');
    this.syncPendingChanges();
  }

  private handleOffline() {
    this.isOnline = false;
    console.log('App is offline - enabling offline mode');
  }

  // Check if app is online
  isAppOnline(): boolean {
    return this.isOnline;
  }

  // Store data locally
  async storeLocally(table: string, data: any): Promise<void> {
    if (!this.db) return;

    try {
      await this.db.put(table as any, data);
      console.log(`Stored ${table} data locally:`, data.id);
    } catch (error) {
      console.error(`Failed to store ${table} data locally:`, error);
    }
  }

  // Get data from local storage
  async getLocalData(table: string, id?: string): Promise<any> {
    if (!this.db) return null;

    try {
      if (id) {
        return await this.db.get(table as any, id);
      } else {
        return await this.db.getAll(table as any);
      }
    } catch (error) {
      console.error(`Failed to get ${table} data locally:`, error);
      return null;
    }
  }

  // Add operation to sync queue
  async addToSyncQueue(operation: {
    type: 'create' | 'update' | 'delete';
    table: string;
    data: any;
  }): Promise<void> {
    if (!this.db) return;

    const syncItem = {
      id: `${operation.table}_${operation.data.id || Date.now()}_${Date.now()}`,
      ...operation,
      timestamp: Date.now(),
    };

    try {
      await this.db.put('pending_sync', syncItem);
      console.log('Added to sync queue:', syncItem);

      // If online, try to sync immediately
      if (this.isOnline) {
        this.syncPendingChanges();
      }
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
    }
  }

  // Sync pending changes with server
  async syncPendingChanges(): Promise<void> {
    if (!this.db || this.syncInProgress || !this.isOnline) return;

    this.syncInProgress = true;
    console.log('Starting sync of pending changes');

    try {
      const pendingItems = await this.db.getAll('pending_sync');
      
      for (const item of pendingItems) {
        try {
          await this.syncSingleItem(item);
          // Remove from sync queue after successful sync
          await this.db.delete('pending_sync', item.id);
          console.log('Synced and removed from queue:', item.id);
        } catch (error) {
          console.error('Failed to sync item:', item.id, error);
          // Keep in queue for retry
        }
      }
    } catch (error) {
      console.error('Sync process failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync a single item with server
  private async syncSingleItem(item: any): Promise<void> {
    // This would integrate with your actual API
    // For now, we'll simulate the sync
    console.log('Syncing item with server:', item);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In real implementation, you would:
    // 1. Send the data to your server API
    // 2. Handle conflicts if data was modified on server
    // 3. Update local data with server response
  }

  // Backup critical data
  async createBackup(): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const backup = {
        timestamp: new Date().toISOString(),
        products: await this.db.getAll('products'),
        customers: await this.db.getAll('customers'),
        transactions: await this.db.getAll('transactions'),
        settings: await this.db.getAll('settings'),
      };

      const backupString = JSON.stringify(backup);
      
      // Store backup in localStorage as well
      localStorage.setItem('businesspos_backup', backupString);
      
      return backupString;
    } catch (error) {
      console.error('Failed to create backup:', error);
      throw error;
    }
  }

  // Restore from backup
  async restoreFromBackup(backupString: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const backup = JSON.parse(backupString);
      
      // Clear existing data
      await this.clearAllData();
      
      // Restore data
      const tx = this.db.transaction(['products', 'customers', 'transactions', 'settings'], 'readwrite');
      
      for (const product of backup.products || []) {
        await tx.objectStore('products').put(product);
      }
      
      for (const customer of backup.customers || []) {
        await tx.objectStore('customers').put(customer);
      }
      
      for (const transaction of backup.transactions || []) {
        await tx.objectStore('transactions').put(transaction);
      }
      
      for (const setting of backup.settings || []) {
        await tx.objectStore('settings').put(setting);
      }
      
      await tx.done;
      console.log('Backup restored successfully');
    } catch (error) {
      console.error('Failed to restore backup:', error);
      throw error;
    }
  }

  // Clear all local data
  async clearAllData(): Promise<void> {
    if (!this.db) return;

    try {
      const tx = this.db.transaction(['products', 'customers', 'transactions', 'pending_sync', 'settings'], 'readwrite');
      
      await tx.objectStore('products').clear();
      await tx.objectStore('customers').clear();
      await tx.objectStore('transactions').clear();
      await tx.objectStore('pending_sync').clear();
      await tx.objectStore('settings').clear();
      
      await tx.done;
      console.log('All local data cleared');
    } catch (error) {
      console.error('Failed to clear local data:', error);
    }
  }

  // Get sync status
  async getSyncStatus(): Promise<{
    pendingCount: number;
    lastSync: Date | null;
    isOnline: boolean;
  }> {
    if (!this.db) {
      return { pendingCount: 0, lastSync: null, isOnline: this.isOnline };
    }

    try {
      const pendingItems = await this.db.getAll('pending_sync');
      const lastSyncSetting = await this.db.get('settings', 'last_sync');
      
      return {
        pendingCount: pendingItems.length,
        lastSync: lastSyncSetting ? new Date(lastSyncSetting.value) : null,
        isOnline: this.isOnline,
      };
    } catch (error) {
      console.error('Failed to get sync status:', error);
      return { pendingCount: 0, lastSync: null, isOnline: this.isOnline };
    }
  }

  // Update last sync timestamp
  async updateLastSync(): Promise<void> {
    if (!this.db) return;

    try {
      await this.db.put('settings', {
        key: 'last_sync',
        value: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to update last sync:', error);
    }
  }

  // Force sync now
  async forceSyncNow(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    
    await this.syncPendingChanges();
    await this.updateLastSync();
  }
}

// Create singleton instance
export const offlineManager = new OfflineManager();

// Initialize on module load
offlineManager.initialize();

export default offlineManager;
