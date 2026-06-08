import React from 'react';
import type { ProductCategory } from '../../types';

const CATEGORIES: { label: string; value: ProductCategory | 'All'; emoji: string; color: string }[] = [
  { label: 'All',         value: 'All',         emoji: '🍽️', color: 'bg-gray-700 text-white border-gray-600' },
  { label: 'Tea',         value: 'Tea',         emoji: '🍵', color: 'bg-emerald-600 text-white border-emerald-500' },
  { label: 'Coffee',      value: 'Coffee',      emoji: '☕', color: 'bg-amber-700 text-white border-amber-600' },
  { label: 'Snacks',      value: 'Snacks',      emoji: '🥟', color: 'bg-orange-600 text-white border-orange-500' },
  { label: 'Cool Drinks', value: 'Cool Drinks', emoji: '🥤', color: 'bg-sky-600 text-white border-sky-500' },
];

interface Props {
  selected: ProductCategory | 'All';
  onChange: (cat: ProductCategory | 'All') => void;
}

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
              isActive
                ? cat.color + ' shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
