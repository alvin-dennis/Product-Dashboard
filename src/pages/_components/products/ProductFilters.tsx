import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useFilterStore } from '@/stores/filterStore';
import { useCategories } from '@/hooks/useProducts';

export const ProductFilters = () => {
  const {
    searchQuery,
    selectedCategory,
    sortBy,
    priceRange,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setPriceRange,
    resetFilters,
  } = useFilterStore();

  const { data: categories } = useCategories();

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'all' || sortBy !== 'default' || priceRange[0] > 0 || priceRange[1] < 2000;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category} value={category}>
                  <span className="capitalize">{category.replace('-', ' ')}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                ${priceRange[0]} - ${priceRange[1]}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Price Range</h4>
                  <p className="text-sm text-muted-foreground">
                    Filter products by price
                  </p>
                </div>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={2000}
                    min={0}
                    step={10}
                    className="py-4"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">${priceRange[0]}</span>
                    <span className="text-muted-foreground">to</span>
                    <span className="font-medium">${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[160px]">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Best Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="gap-1 capitalize">
              {selectedCategory.replace('-', ' ')}
              <button onClick={() => setSelectedCategory('all')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {sortBy !== 'default' && (
            <Badge variant="secondary" className="gap-1">
              {sortBy === 'price-asc'
                ? 'Price ↑'
                : sortBy === 'price-desc'
                  ? 'Price ↓'
                  : 'Top Rated'}
              <button onClick={() => setSortBy('default')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {(priceRange[0] > 0 || priceRange[1] < 2000) && (
            <Badge variant="secondary" className="gap-1">
              ${priceRange[0]} - ${priceRange[1]}
              <button onClick={() => setPriceRange([0, 2000])}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear all
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
