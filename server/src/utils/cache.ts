/**
 * Simple In-Memory Cache Utility
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F007 - Admin Dashboard Performance
 * Description: Provides caching functionality for analytics and other frequently accessed data
 * Last Updated: 2025-10-22
 */

interface CacheEntry {
  data: any;
  expiresAt: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry> = new Map();

  /**
   * Store data in cache with TTL (Time To Live)
   * @param key - Unique cache key
   * @param data - Data to cache
   * @param ttlSeconds - Time to live in seconds (default: 300 = 5 minutes)
   */
  set(key: string, data: any, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + (ttlSeconds * 1000)
    });
  }

  /**
   * Retrieve data from cache
   * @param key - Cache key
   * @returns Cached data or null if not found/expired
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Delete specific cache entry
   * @param key - Cache key to delete
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns Object with cache stats
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const cache = new SimpleCache();

// Clean up expired entries every 5 minutes
setInterval(() => {
  cache.cleanup();
}, 5 * 60 * 1000);

