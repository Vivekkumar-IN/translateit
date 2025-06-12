
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SearchFilters {
  searchTerm: string;
  showOnlyUntranslated: boolean;
  showOnlyTranslated: boolean;
}

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  totalKeys: number;
  filteredKeys: number;
  translatedKeys: number;
  allKeys: string[];
  yamlData: { [key: string]: string };
  translations: { [key: string]: string };
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  filters,
  onFiltersChange,
  totalKeys,
  filteredKeys,
  translatedKeys,
  allKeys,
  yamlData,
  translations
}) => {
  const [searchInput, setSearchInput] = useState(filters.searchTerm);

  // Calculate the actual filtered count based on current filters
  const getFilteredKeys = () => {
    return allKeys.filter(key => {
      // Search by key name (exact match and partial match)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const keyLower = key.toLowerCase();
        
        // Check if the search term matches the key exactly or partially
        if (!keyLower.includes(searchLower)) {
          return false;
        }
      }

      // Translation status filters
      const isTranslated = !!translations[key];
      if (filters.showOnlyUntranslated && isTranslated) return false;
      if (filters.showOnlyTranslated && !isTranslated) return false;

      return true;
    });
  };

  const actualFilteredKeys = getFilteredKeys();
  const actualFilteredCount = actualFilteredKeys.length;

  // Auto-search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter('searchTerm', searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    let newFilters = { ...filters, [key]: value };
    
    // Handle conflicting translation status filters
    if (key === 'showOnlyUntranslated' && value === true) {
      newFilters.showOnlyTranslated = false;
    } else if (key === 'showOnlyTranslated' && value === true) {
      newFilters.showOnlyUntranslated = false;
    }
    
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
  };

  const clearSearch = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setSearchInput('');
    updateFilter('searchTerm', '');
  };

  const handleFilterClick = (filterType: 'showOnlyUntranslated' | 'showOnlyTranslated', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateFilter(filterType, !filters[filterType]);
  };

  const activeFiltersCount = [
    filters.searchTerm,
    filters.showOnlyUntranslated,
    filters.showOnlyTranslated
  ].filter(value => value !== '' && value !== false).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Search className="w-4 h-4" />
          Search & Filter
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search keys (e.g., play_4, main_body)..."
            value={searchInput}
            onChange={handleSearchChange}
            className="pl-10 pr-10"
          />
          {searchInput && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.showOnlyUntranslated ? "default" : "outline"}
            size="sm"
            onClick={(e) => handleFilterClick('showOnlyUntranslated', e)}
            className="text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            Untranslated
          </Button>
          <Button
            variant={filters.showOnlyTranslated ? "default" : "outline"}
            size="sm"
            onClick={(e) => handleFilterClick('showOnlyTranslated', e)}
            className="text-xs"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Translated
          </Button>
        </div>

        {/* Results summary */}
        <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
          <span>
            Showing {actualFilteredCount} of {totalKeys} keys
          </span>
          <span>
            {translatedKeys} translated
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
