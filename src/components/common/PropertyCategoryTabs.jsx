// import { Button } from '@/components/ui/button';
// import { PROPERTY_CATEGORIES, CATEGORY_LABELS } from '@/constants/categories';
// import { cn } from '@/lib/utils';

// export default function PropertyCategoryTabs({ 
//   selectedCategory = 'all', 
//   onCategoryChange,
//   className = ''
// }) {
// const categories = ['all', ...Object.keys(CATEGORY_LABELS)];


//   const categoryDisplayNames = {
//     all: 'All Properties',
//     ...CATEGORY_LABELS
//   };

//   return (
//     <div className={cn("flex flex-wrap gap-3 justify-center", className)}>
//       {categories.map((category) => {
//         const isActive = selectedCategory === category;
//         const displayName = categoryDisplayNames[category];

//         return (
//           <Button
//             key={category}
//             variant={isActive ? "default" : "outline"}
//             className={cn(
//               "px-8 py-3 rounded-full font-medium transition-all duration-200",
//               isActive 
//                 ? 'bg-primary text-white hover:bg-primary/90 shadow-lg scale-105' 
//                 : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200 hover:border-primary/30'
//             )}
//             onClick={() => onCategoryChange?.(category)}
//           >
//             {displayName}
//           </Button>
//         );
//       })}
//     </div>
//   );
// }



import { Button } from '@/components/ui/button';
import { PROPERTY_CATEGORIES, CATEGORY_LABELS } from '@/constants/categories';
import { cn } from '@/lib/utils';

export default function PropertyCategoryTabs({ 
  selectedCategory = 'all', 
  onCategoryChange,
  className = ''
}) {
  const categoryEntries = Object.entries(PROPERTY_CATEGORIES); // [['RESORTS', 1], ...]

  return (
    <div className={cn("flex flex-wrap gap-3 justify-center", className)}>
      <Button
        key="all"
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        className={cn(
          "px-8 py-3 rounded-full font-medium transition-all duration-200",
          selectedCategory === 'all'
            ? 'bg-primary text-white hover:bg-primary/90 shadow-lg scale-105'
            : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200 hover:border-primary/30'
        )}
        onClick={() => onCategoryChange('all')}
      >
        All Properties
      </Button>

      {categoryEntries.map(([key, id]) => {
        const label = CATEGORY_LABELS[id];
        const isActive = selectedCategory === id;

        return (
          <Button
            key={id}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "px-8 py-3 rounded-full font-medium transition-all duration-200",
              isActive 
                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg scale-105' 
                : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200 hover:border-primary/30'
            )}
            onClick={() => onCategoryChange(id)}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
