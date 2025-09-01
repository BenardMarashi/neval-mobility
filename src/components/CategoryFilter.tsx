// src/components/CategoryFilter.tsx - COMPLETE REPLACEMENT
import React from 'react';
import { CarCategory, CATEGORY_LABELS } from '../types/Car';
import './CategoryFilter.css';

interface CategoryFilterProps {
  selectedCategory: CarCategory | 'all';
  onCategoryChange: (category: CarCategory | 'all') => void;
  counts?: Record<CarCategory | 'all', number>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  counts
}) => {
  const categories: (CarCategory | 'all')[] = [
    'all',
    'ocean network',
    'dynasty network',
    'denza',
    'leopard'
  ];


  const getCategoryDisplay = (cat: CarCategory | 'all'): string => {
    if (cat === 'all') return 'All Models';
    return CATEGORY_LABELS[cat as CarCategory];
  };

  return (
    <div className="category-filter">
      <div className="category-pills">
        {categories.map(category => (
          <button
            key={category}
            className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            <span className="pill-label">{getCategoryDisplay(category)}</span>
            {counts && (
              <span className="pill-count">{counts[category] || 0}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;