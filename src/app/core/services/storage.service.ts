import { Injectable } from '@angular/core';

// 💾 Generic Storage Service - Handles CRUD operations with LocalStorage
// This service guarantees offline persistence and type-safe operations
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * 🔍 Retrieves an item from LocalStorage
   * @param key - The storage key
   * @returns Parsed object or null if not found
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from storage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * 💾 Saves an item to LocalStorage
   * @param key - The storage key
   * @param value - The value to store
   * @returns true if successful, false otherwise
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to storage (key: ${key}):`, error);
      return false;
    }
  }

  /**
   * 🗑️ Removes an item from LocalStorage
   * @param key - The storage key
   * @returns true if successful, false otherwise
   */
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from storage (key: ${key}):`, error);
      return false;
    }
  }

  /**
   * 🧹 Clears all LocalStorage
   * @returns true if successful, false otherwise
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * 🔀 Retrieves all keys from LocalStorage
   * @returns Array of all storage keys
   */
  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * 📊 Checks if a key exists in LocalStorage
   * @param key - The key to check
   * @returns true if key exists, false otherwise
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
