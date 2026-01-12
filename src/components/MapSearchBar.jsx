import { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MapSearchBar = ({ places, onPlaceSelect, onSearchChange }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      onSearchChange('');
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = places.filter(place => {
      // Search by name
      if (place.name.toLowerCase().includes(searchTerm)) return true;
      
      // Search by location
      if (place.location.toLowerCase().includes(searchTerm)) return true;
      
      // Search by tags
      if (place.tags?.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
      
      return false;
    });

    setResults(filtered.slice(0, 5)); // Limit to 5 results
    onSearchChange(query);
  }, [query, places, onSearchChange]);

  const handlePlaceSelect = (place) => {
    setQuery('');
    setResults([]);
    setIsFocused(false);
    onPlaceSelect(place);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsFocused(false);
    onSearchChange('');
    inputRef.current?.blur();
  };

  return (
    <div className="absolute top-4 right-4 z-30 w-[calc(100%-2rem)] max-w-2xl" dir="rtl">
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search 
            size={20} 
            className="absolute right-3 text-gray-400 pointer-events-none" 
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow click on results
              setTimeout(() => setIsFocused(false), 200);
            }}
            placeholder="חפש מקום או אזור..."
            className="w-full pr-10 pl-10 py-3 rounded-2xl border-0 bg-white/95 backdrop-blur-md shadow-lg text-right font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            dir="rtl"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute left-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {isFocused && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl overflow-hidden z-30 max-h-80 overflow-y-auto"
            >
              {results.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handlePlaceSelect(place)}
                  className="w-full p-4 hover:bg-gray-50 transition-colors text-right border-b border-gray-100 last:border-0"
                  dir="rtl"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                      <MapPin size={18} className="text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 mb-1 truncate">{place.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">{place.location}</p>
                      {place.tags && place.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {place.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MapSearchBar;
