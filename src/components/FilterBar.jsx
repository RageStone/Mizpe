import { useState } from 'react';

const FILTERS = [
  { id: 'all', label: 'הכל' },
  { id: 'nearby', label: 'קרוב' },
  { id: 'accessible', label: 'נגיש' },
  { id: 'romantic', label: 'רומנטי' },
  { id: 'water', label: 'מים' },
  { id: 'picnic', label: 'פיקניק' }
];

const FilterBar = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide pb-2" dir="rtl">
      <div className="flex gap-2 px-4">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`filter-btn ${
              activeFilter === filter.id
                ? 'filter-btn-active'
                : 'filter-btn-inactive'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;

