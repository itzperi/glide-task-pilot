
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useTasks } from '@/contexts/TaskContext';

const SearchBar: React.FC = () => {
  const { state, setFilter } = useTasks();
  const [searchTerm, setSearchTerm] = useState(state.filter.search);
  
  useEffect(() => {
    setSearchTerm(state.filter.search);
  }, [state.filter.search]);
  
  const handleSearch = () => {
    setFilter({ search: searchTerm });
  };
  
  const handleClear = () => {
    setSearchTerm('');
    setFilter({ search: '' });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="flex items-center space-x-2 w-full max-w-md">
      <div className="relative flex-1">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
          className="pr-8"
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button variant="default" size="icon" onClick={handleSearch}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchBar;
