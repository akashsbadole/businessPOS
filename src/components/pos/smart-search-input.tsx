import React from "react";
import { Input, Button, Kbd } from "@heroui/react";
import { Icon } from "@iconify/react";
import { SearchSuggestions } from "./search-suggestions";

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

interface SmartSearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  products: Product[];
  onProductSelect: (product: Product) => void;
  onCategoryFilter?: (category: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  autoFocus?: boolean;
  showVoiceButton?: boolean;
  onVoiceSearch?: () => void;
  showAdvancedSearch?: boolean;
  onAdvancedSearch?: () => void;
  isLoading?: boolean;
}

export const SmartSearchInput: React.FC<SmartSearchInputProps> = ({
  value,
  onValueChange,
  products,
  onProductSelect,
  onCategoryFilter,
  placeholder = "Search products, categories, or scan barcode...",
  size = "md",
  className = "",
  autoFocus = false,
  showVoiceButton = true,
  onVoiceSearch,
  showAdvancedSearch = true,
  onAdvancedSearch,
  isLoading = false,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < 7 ? prev + 1 : 0 // Assuming max 8 suggestions
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : 7
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0) {
        // Handle suggestion selection
        // This would be implemented with the actual suggestion data
      } else {
        // Handle direct search
        handleDirectSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Handle direct search (when user presses Enter without selecting suggestion)
  const handleDirectSearch = () => {
    if (!value.trim()) return;
    
    // Try to find exact product match
    const exactMatch = products.find(p => 
      p.name.toLowerCase() === value.toLowerCase() ||
      p.barcode === value ||
      p.hsn === value
    );
    
    if (exactMatch) {
      onProductSelect(exactMatch);
      onValueChange('');
    } else {
      // Filter products and show results
      console.log('Searching for:', value);
    }
    
    setShowSuggestions(false);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category') {
      onCategoryFilter?.(suggestion.data.category);
      onValueChange('');
    } else if (suggestion.type === 'history') {
      onValueChange(suggestion.text);
    } else {
      onValueChange(suggestion.text);
    }
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle product selection from suggestions
  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    onValueChange('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
        setIsFocused(false);
        setSelectedSuggestionIndex(-1);
      }
    }, 150);
  };

  // Handle input change
  const handleInputChange = (newValue: string) => {
    onValueChange(newValue);
    setShowSuggestions(true);
    setSelectedSuggestionIndex(-1);
    
    // Auto-select product if exact barcode match
    if (newValue.length >= 8) { // Typical barcode length
      const barcodeMatch = products.find(p => p.barcode === newValue);
      if (barcodeMatch) {
        onProductSelect(barcodeMatch);
        onValueChange('');
        setShowSuggestions(false);
        return;
      }
    }
  };

  // Click outside to close suggestions
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to clear search
      if (e.key === 'Escape' && isFocused) {
        onValueChange('');
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isFocused, onValueChange]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onValueChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        size={size}
        autoFocus={autoFocus}
        isClearable
        startContent={
          <Icon 
            icon={isLoading ? "lucide:loader-2" : "lucide:search"} 
            className={isLoading ? "animate-spin" : ""}
          />
        }
        endContent={
          <div className="flex items-center gap-1">
            {/* Keyboard shortcut hint */}
            <Kbd className="hidden sm:inline-block">Ctrl+F</Kbd>
            
            {/* Voice search button */}
            {showVoiceButton && onVoiceSearch && (
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={onVoiceSearch}
                title="Voice Search"
                className="min-w-unit-8 w-unit-8 h-unit-8"
              >
                <Icon icon="lucide:mic" className="w-4 h-4" />
              </Button>
            )}
            
            {/* Advanced search button */}
            {showAdvancedSearch && onAdvancedSearch && (
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={onAdvancedSearch}
                title="Advanced Search"
                className="min-w-unit-8 w-unit-8 h-unit-8"
              >
                <Icon icon="lucide:sliders-horizontal" className="w-4 h-4" />
              </Button>
            )}
          </div>
        }
        classNames={{
          input: "text-sm",
          inputWrapper: isFocused ? "ring-2 ring-primary-200" : "",
        }}
        description={
          isFocused && value.length === 0 
            ? "Type to search products, scan barcode, or use voice search"
            : undefined
        }
      />
      
      {/* Search Suggestions */}
      <SearchSuggestions
        searchQuery={value}
        products={products}
        isVisible={showSuggestions && isFocused}
        onSuggestionSelect={handleSuggestionSelect}
        onProductSelect={handleProductSelect}
        maxSuggestions={8}
        showCategories={true}
        showHistory={true}
      />
      
      {/* Search Tips */}
      {isFocused && value.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-40 mt-1">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <div className="font-medium text-blue-800 mb-1">Search Tips:</div>
            <ul className="text-blue-700 space-y-1">
              <li>• Type product name, barcode, or HSN code</li>
              <li>• Use voice search with the microphone button</li>
              <li>• Press Ctrl+F to quickly focus search</li>
              <li>• Recent searches will appear as suggestions</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
