/**
 * Search Analytics Service
 * Tracks search patterns, popular products, and provides intelligent suggestions
 */

interface SearchEvent {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
  selectedProduct?: string;
  searchType: 'manual' | 'voice' | 'barcode' | 'suggestion';
  sessionId: string;
}

interface ProductPopularity {
  productId: string;
  productName: string;
  searchCount: number;
  selectCount: number;
  lastSearched: Date;
  searchTerms: string[];
}

interface SearchSuggestion {
  term: string;
  frequency: number;
  lastUsed: Date;
  resultCount: number;
  successRate: number; // How often this search leads to a product selection
}

interface SearchAnalytics {
  totalSearches: number;
  uniqueSearchTerms: number;
  averageResultsPerSearch: number;
  topSearchTerms: string[];
  popularProducts: ProductPopularity[];
  searchTrends: { date: string; count: number }[];
  conversionRate: number; // Searches that lead to product selection
}

export class SearchAnalyticsService {
  private sessionId: string;
  private searchEvents: SearchEvent[] = [];
  private productPopularity: Map<string, ProductPopularity> = new Map();
  private searchSuggestions: Map<string, SearchSuggestion> = new Map();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadFromStorage();
  }

  /**
   * Track a search event
   */
  trackSearch(
    query: string,
    resultCount: number,
    searchType: 'manual' | 'voice' | 'barcode' | 'suggestion' = 'manual'
  ): string {
    const event: SearchEvent = {
      id: this.generateEventId(),
      query: query.toLowerCase().trim(),
      timestamp: new Date(),
      resultCount,
      searchType,
      sessionId: this.sessionId,
    };

    this.searchEvents.push(event);
    this.updateSearchSuggestions(event);
    this.saveToStorage();

    return event.id;
  }

  /**
   * Track when a user selects a product from search results
   */
  trackProductSelection(searchEventId: string, productId: string, productName: string) {
    const event = this.searchEvents.find(e => e.id === searchEventId);
    if (event) {
      event.selectedProduct = productId;
      this.updateProductPopularity(productId, productName, event.query);
      this.updateSearchSuggestionSuccess(event.query);
      this.saveToStorage();
    }
  }

  /**
   * Get intelligent search suggestions based on user history
   */
  getSearchSuggestions(query: string, limit: number = 5): string[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) {
      // Return recent successful searches
      return Array.from(this.searchSuggestions.values())
        .filter(s => s.successRate > 0.3) // Only suggest searches with good success rate
        .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
        .slice(0, limit)
        .map(s => s.term);
    }

    // Find suggestions that start with or contain the query
    const suggestions = Array.from(this.searchSuggestions.values())
      .filter(s => 
        s.term.includes(normalizedQuery) && 
        s.term !== normalizedQuery &&
        s.successRate > 0.2
      )
      .sort((a, b) => {
        // Prioritize by frequency and success rate
        const scoreA = a.frequency * a.successRate;
        const scoreB = b.frequency * b.successRate;
        return scoreB - scoreA;
      })
      .slice(0, limit)
      .map(s => s.term);

    return suggestions;
  }

  /**
   * Get popular products based on search and selection patterns
   */
  getPopularProducts(limit: number = 10): ProductPopularity[] {
    return Array.from(this.productPopularity.values())
      .sort((a, b) => {
        // Sort by selection count and recency
        const scoreA = a.selectCount + (a.searchCount * 0.1);
        const scoreB = b.selectCount + (b.searchCount * 0.1);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * Get search analytics and insights
   */
  getAnalytics(): SearchAnalytics {
    const totalSearches = this.searchEvents.length;
    const uniqueSearchTerms = new Set(this.searchEvents.map(e => e.query)).size;
    const averageResultsPerSearch = totalSearches > 0 
      ? this.searchEvents.reduce((sum, e) => sum + e.resultCount, 0) / totalSearches 
      : 0;

    // Top search terms
    const termCounts = new Map<string, number>();
    this.searchEvents.forEach(e => {
      termCounts.set(e.query, (termCounts.get(e.query) || 0) + 1);
    });
    const topSearchTerms = Array.from(termCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term]) => term);

    // Search trends (last 7 days)
    const searchTrends = this.getSearchTrends(7);

    // Conversion rate
    const searchesWithSelection = this.searchEvents.filter(e => e.selectedProduct).length;
    const conversionRate = totalSearches > 0 ? (searchesWithSelection / totalSearches) * 100 : 0;

    return {
      totalSearches,
      uniqueSearchTerms,
      averageResultsPerSearch,
      topSearchTerms,
      popularProducts: this.getPopularProducts(),
      searchTrends,
      conversionRate,
    };
  }

  /**
   * Get search trends for the last N days
   */
  private getSearchTrends(days: number): { date: string; count: number }[] {
    const trends: { date: string; count: number }[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = this.searchEvents.filter(e => {
        const eventDate = e.timestamp.toISOString().split('T')[0];
        return eventDate === dateStr;
      }).length;

      trends.push({ date: dateStr, count });
    }

    return trends;
  }

  /**
   * Update search suggestions based on new search event
   */
  private updateSearchSuggestions(event: SearchEvent) {
    const existing = this.searchSuggestions.get(event.query);
    
    if (existing) {
      existing.frequency++;
      existing.lastUsed = event.timestamp;
      existing.resultCount = event.resultCount;
    } else {
      this.searchSuggestions.set(event.query, {
        term: event.query,
        frequency: 1,
        lastUsed: event.timestamp,
        resultCount: event.resultCount,
        successRate: 0,
      });
    }
  }

  /**
   * Update success rate when a search leads to product selection
   */
  private updateSearchSuggestionSuccess(query: string) {
    const suggestion = this.searchSuggestions.get(query);
    if (suggestion) {
      const totalSearches = this.searchEvents.filter(e => e.query === query).length;
      const successfulSearches = this.searchEvents.filter(e => 
        e.query === query && e.selectedProduct
      ).length;
      
      suggestion.successRate = successfulSearches / totalSearches;
    }
  }

  /**
   * Update product popularity metrics
   */
  private updateProductPopularity(productId: string, productName: string, searchTerm: string) {
    const existing = this.productPopularity.get(productId);
    
    if (existing) {
      existing.selectCount++;
      existing.lastSearched = new Date();
      if (!existing.searchTerms.includes(searchTerm)) {
        existing.searchTerms.push(searchTerm);
      }
    } else {
      this.productPopularity.set(productId, {
        productId,
        productName,
        searchCount: 1,
        selectCount: 1,
        lastSearched: new Date(),
        searchTerms: [searchTerm],
      });
    }
  }

  /**
   * Clear old data to prevent storage bloat
   */
  cleanupOldData(daysToKeep: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    // Remove old search events
    this.searchEvents = this.searchEvents.filter(e => e.timestamp > cutoffDate);

    // Remove old suggestions with low frequency
    for (const [term, suggestion] of this.searchSuggestions.entries()) {
      if (suggestion.lastUsed < cutoffDate && suggestion.frequency < 3) {
        this.searchSuggestions.delete(term);
      }
    }

    this.saveToStorage();
  }

  /**
   * Export analytics data
   */
  exportData() {
    return {
      searchEvents: this.searchEvents,
      productPopularity: Array.from(this.productPopularity.values()),
      searchSuggestions: Array.from(this.searchSuggestions.values()),
      analytics: this.getAnalytics(),
    };
  }

  /**
   * Clear all analytics data
   */
  clearAllData() {
    this.searchEvents = [];
    this.productPopularity.clear();
    this.searchSuggestions.clear();
    localStorage.removeItem('pos-search-analytics');
    localStorage.removeItem('pos-product-popularity');
    localStorage.removeItem('pos-search-suggestions');
  }

  // Private utility methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveToStorage() {
    try {
      localStorage.setItem('pos-search-analytics', JSON.stringify(this.searchEvents.slice(-1000))); // Keep last 1000 events
      localStorage.setItem('pos-product-popularity', JSON.stringify(Array.from(this.productPopularity.entries())));
      localStorage.setItem('pos-search-suggestions', JSON.stringify(Array.from(this.searchSuggestions.entries())));
    } catch (error) {
      console.error('Error saving search analytics:', error);
    }
  }

  private loadFromStorage() {
    try {
      // Load search events
      const events = localStorage.getItem('pos-search-analytics');
      if (events) {
        this.searchEvents = JSON.parse(events).map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
      }

      // Load product popularity
      const popularity = localStorage.getItem('pos-product-popularity');
      if (popularity) {
        const entries = JSON.parse(popularity);
        this.productPopularity = new Map(entries.map(([key, value]: [string, any]) => [
          key,
          { ...value, lastSearched: new Date(value.lastSearched) }
        ]));
      }

      // Load search suggestions
      const suggestions = localStorage.getItem('pos-search-suggestions');
      if (suggestions) {
        const entries = JSON.parse(suggestions);
        this.searchSuggestions = new Map(entries.map(([key, value]: [string, any]) => [
          key,
          { ...value, lastUsed: new Date(value.lastUsed) }
        ]));
      }
    } catch (error) {
      console.error('Error loading search analytics:', error);
    }
  }
}

// Export singleton instance
export const searchAnalyticsService = new SearchAnalyticsService();
