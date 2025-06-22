import { Button } from '@/components/ui/button';
import { PROPERTY_CATEGORIES, CATEGORY_LABELS, PropertyCategory } from '@/constants/categories';
import { cn } from '@/lib/utils';

interface PropertyCategoryTabsProps {
  selectedCategory?: PropertyCategory | 'all';
  onCategoryChange?: (category: PropertyCategory | 'all') => void;
  className?: string;
}

export default function PropertyCategoryTabs({ 
  selectedCategory = 'all', 
  onCategoryChange,
  className = ''
}: PropertyCategoryTabsProps) {
  const categories = ['all', ...Object.values(PROPERTY_CATEGORIES)] as const;

  const categoryDisplayNames = {
    all: 'All Properties',
    ...CATEGORY_LABELS
  };

  return (
    <div className={cn("flex flex-wrap gap-3 justify-center", className)}>
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        const displayName = categoryDisplayNames[category as keyof typeof categoryDisplayNames];
        
        return (
          <Button
            key={category}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "px-8 py-3 rounded-full font-medium transition-all duration-200",
              isActive 
                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg scale-105' 
                : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200 hover:border-primary/30'
            )}
            onClick={() => onCategoryChange?.(category as PropertyCategory | 'all')}
          >
            {displayName}
          </Button>
        );
      })}
    </div>
  );
}