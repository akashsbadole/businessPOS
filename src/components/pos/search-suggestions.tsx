import React from "react";
import {
  Card,
  CardBody,
  Chip,
  Button,
  Divider,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  barcode?: string;
  hsn?: string;
}

interface SearchSuggestion {
  id: string;
  type: 'product' | 'category' | 'history' | 'barcode' | 'hsn';
  text: string;
  subtitle?: string;
  icon?: string;
  data?: any;
  frequency?: number;
}

interface SearchSuggestionsProps {
  searchQuery: string;
  products: Product[];
  isVisible: boolean;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  onProductSelect: (product: Product) => void;
  maxSuggestions?: number;
  showCategories?: boolean;
  showHistory?: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  searchQuery,
  products,
  isVisible,
  onSuggestionSelect,
  onProductSelect,
  maxSuggestions = 8,
  showCategories = true,
  showHistory = true,
}) => {
  const [searchHistory, setSearchHistory] = React.useState<string[]>([]);
  const [suggestions, setSuggestions] = React.useState<SearchSuggestion[]>([]);

  // Load search history from localStorage
  React.useEffect(() => {
    const history = localStorage.getItem('pos-search-history');
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  // Generate suggestions based on search query
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      // Show recent searches when no query
      if (showHistory && searchHistory.length > 0) {
        const historySuggestions: SearchSuggestion[] = searchHistory
          .slice(0, 5)
          .map((term, index) => ({
            id: `history-${index}`,
            type: 'history',
            text: term,
            icon: 'lucide:clock',
            frequency: searchHistory.filter(h => h === term).length,
          }));
        setSuggestions(historySuggestions);
      } else {
        setSuggestions([]);
      }
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const newSuggestions: SearchSuggestion[] = [];

    // 1. Exact product matches (highest priority)
    const exactMatches = products.filter(product =>
      product.name.toLowerCase().startsWith(query)
    ).slice(0, 3);

    exactMatches.forEach(product => {
      newSuggestions.push({
        id: `product-exact-${product.id}`,
        type: 'product',
        text: product.name,
        subtitle: `₹${product.price} • Stock: ${product.stock}`,
        icon: 'lucide:package',
        data: product,
      });
    });

    // 2. Partial product matches
    const partialMatches = products.filter(product =>
      product.name.toLowerCase().includes(query) &&
      !product.name.toLowerCase().startsWith(query)
    ).slice(0, 3);

    partialMatches.forEach(product => {
      newSuggestions.push({
        id: `product-partial-${product.id}`,
        type: 'product',
        text: product.name,
        subtitle: `₹${product.price} • Stock: ${product.stock}`,
        icon: 'lucide:package',
        data: product,
      });
    });

    // 3. Barcode matches
    const barcodeMatches = products.filter(product =>
      product.barcode?.toLowerCase().includes(query)
    ).slice(0, 2);

    barcodeMatches.forEach(product => {
      newSuggestions.push({
        id: `barcode-${product.id}`,
        type: 'barcode',
        text: product.name,
        subtitle: `Barcode: ${product.barcode}`,
        icon: 'lucide:barcode',
        data: product,
      });
    });

    // 4. HSN matches
    const hsnMatches = products.filter(product =>
      product.hsn?.toLowerCase().includes(query)
    ).slice(0, 2);

    hsnMatches.forEach(product => {
      newSuggestions.push({
        id: `hsn-${product.id}`,
        type: 'hsn',
        text: product.name,
        subtitle: `HSN: ${product.hsn}`,
        icon: 'lucide:hash',
        data: product,
      });
    });

    // 5. Category suggestions
    if (showCategories) {
      const categories = [...new Set(products.map(p => p.category))];
      const categoryMatches = categories.filter(category =>
        category.toLowerCase().includes(query)
      ).slice(0, 2);

      categoryMatches.forEach(category => {
        const categoryProducts = products.filter(p => p.category === category);
        newSuggestions.push({
          id: `category-${category}`,
          type: 'category',
          text: category,
          subtitle: `${categoryProducts.length} products`,
          icon: 'lucide:tag',
          data: { category, products: categoryProducts },
        });
      });
    }

    // 6. Search history matches
    if (showHistory) {
      const historyMatches = searchHistory.filter(term =>
        term.toLowerCase().includes(query) && term.toLowerCase() !== query
      ).slice(0, 2);

      historyMatches.forEach((term, index) => {
        newSuggestions.push({
          id: `history-match-${index}`,
          type: 'history',
          text: term,
          subtitle: 'Recent search',
          icon: 'lucide:clock',
          frequency: searchHistory.filter(h => h === term).length,
        });
      });
    }

    // Limit total suggestions
    setSuggestions(newSuggestions.slice(0, maxSuggestions));
  }, [searchQuery, products, searchHistory, maxSuggestions, showCategories, showHistory]);

  // Add to search history
  const addToHistory = (term: string) => {
    if (!term.trim()) return;
    
    const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 20);
    setSearchHistory(newHistory);
    localStorage.setItem('pos-search-history', JSON.stringify(newHistory));
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('pos-search-history');
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product' || suggestion.type === 'barcode' || suggestion.type === 'hsn') {
      onProductSelect(suggestion.data);
      addToHistory(suggestion.text);
    } else if (suggestion.type === 'category') {
      // Handle category selection
      onSuggestionSelect(suggestion);
      addToHistory(suggestion.text);
    } else if (suggestion.type === 'history') {
      onSuggestionSelect(suggestion);
    }
  };

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'product':
        return 'lucide:package';
      case 'category':
        return 'lucide:tag';
      case 'history':
        return 'lucide:clock';
      case 'barcode':
        return 'lucide:barcode';
      case 'hsn':
        return 'lucide:hash';
      default:
        return 'lucide:search';
    }
  };

  const getSuggestionColor = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'product':
        return 'primary';
      case 'category':
        return 'secondary';
      case 'history':
        return 'default';
      case 'barcode':
        return 'success';
      case 'hsn':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-hidden">
      <CardBody className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {/* Header */}
          {searchQuery.trim() === '' && searchHistory.length > 0 && (
            <div className="flex justify-between items-center p-3 bg-gray-50">
              <span className="text-sm font-medium text-gray-600">Recent Searches</span>
              <Button
                size="sm"
                variant="light"
                color="danger"
                onPress={clearHistory}
                startContent={<Icon icon="lucide:trash-2" className="w-3 h-3" />}
              >
                Clear
              </Button>
            </div>
          )}

          {/* Suggestions */}
          <div className="divide-y divide-gray-100">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Avatar
                  icon={<Icon icon={getSuggestionIcon(suggestion)} />}
                  className="w-8 h-8"
                  color={getSuggestionColor(suggestion) as any}
                  size="sm"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">
                      {suggestion.text}
                    </span>
                    {suggestion.type === 'product' && suggestion.data?.stock <= 5 && (
                      <Chip size="sm" color="warning" variant="flat">
                        Low Stock
                      </Chip>
                    )}
                    {suggestion.frequency && suggestion.frequency > 1 && (
                      <Chip size="sm" color="default" variant="flat">
                        {suggestion.frequency}x
                      </Chip>
                    )}
                  </div>
                  {suggestion.subtitle && (
                    <p className="text-sm text-gray-500 truncate">
                      {suggestion.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {suggestion.type === 'product' && (
                    <Chip
                      size="sm"
                      color="primary"
                      variant="flat"
                      className="text-xs"
                    >
                      Add to Cart
                    </Chip>
                  )}
                  <Icon icon="lucide:arrow-up-left" className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {searchQuery.trim() !== '' && (
            <>
              <Divider />
              <div className="p-3 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {suggestions.filter(s => s.type === 'product').length} products found
                  </span>
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:info" className="w-4 h-4" />
                    <span>Press Enter to search all</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
