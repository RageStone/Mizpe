import { useState } from 'react';
import { Car, Mountain, Users, Shield } from 'lucide-react';

const MAP_FILTERS = [
  { id: 'nearby', label: 'קרוב', icon: null },
  { id: 'accessible', label: 'נגיש', icon: Car },
  { id: 'wowScenery', label: 'נוף מדהים', icon: Mountain },
  { id: 'familyFriendly', label: 'מתאים למשפחות', icon: Users },
];

const MapFilterBar = ({ activeFilters, onFilterChange, safeToVisit, onSafeToVisitChange }) => {
  const toggleFilter = (filterId) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter(f => f !== filterId));
    } else {
      onFilterChange([...activeFilters, filterId]);
    }
  };

  return (
    <div className="absolute top-20 right-4 z-20 w-[calc(100%-2rem)] max-w-2xl" dir="rtl">
      {/* All Filters in One Line with Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'thin' }}>
        {MAP_FILTERS.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilters.includes(filter.id);
          
          return (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`filter-btn flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                isActive
                  ? 'filter-btn-active'
                  : 'filter-btn-inactive'
              }`}
            >
              {Icon && <Icon size={16} />}
              <span>{filter.label}</span>
            </button>
          );
        })}
        
        {/* Safe to Visit Toggle - Also in the same line */}
        <button
          onClick={() => onSafeToVisitChange(!safeToVisit)}
          className={`filter-btn flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
            safeToVisit
              ? 'filter-btn-active'
              : 'filter-btn-inactive'
          }`}
        >
          <Shield size={16} />
          <span>בטוח לבקר עכשיו</span>
        </button>
      </div>
    </div>
  );
};


export default MapFilterBar;
