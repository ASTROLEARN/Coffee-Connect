import { useState } from "react";
import { 
  useGetCategories, 
  getGetCategoriesQueryKey,
  useListMenuItems,
  getListMenuItemsQueryKey
} from "@/lib/api";
import { MenuItemCard } from "@/components/MenuItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data: categories, isLoading: categoriesLoading } = useGetCategories({
    query: { queryKey: getGetCategoriesQueryKey() }
  });

  const queryParams = activeCategory === "all" ? {} : { category: activeCategory };
  
  const { data: menuItems, isLoading: itemsLoading } = useListMenuItems(
    queryParams,
    { query: { queryKey: getListMenuItemsQueryKey(queryParams) } }
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Our Menu
          </h1>
          <p className="font-sans text-lg text-muted-foreground">
            Explore our carefully curated selection of artisanal beverages, fresh pastries, and whole bean coffee.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="mb-12 flex justify-center">
          {categoriesLoading ? (
            <Skeleton className="h-12 w-full max-w-2xl rounded-full" />
          ) : (
            <Tabs 
              value={activeCategory} 
              onValueChange={setActiveCategory}
              className="w-full max-w-full overflow-x-auto pb-4"
            >
              <TabsList className="h-auto p-1 bg-secondary rounded-full inline-flex w-max min-w-full justify-start md:justify-center">
                <TabsTrigger 
                  value="all" 
                  className="rounded-full px-6 py-2.5 font-serif text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  All Items
                </TabsTrigger>
                {categories?.map((category) => (
                  <TabsTrigger 
                    key={category.name} 
                    value={category.name}
                    className="rounded-full px-6 py-2.5 font-serif text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all capitalize"
                  >
                    {category.name} ({category.count})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>

        {/* Menu Grid */}
        {itemsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : menuItems && menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/50 rounded-2xl border border-border border-dashed">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">We couldn't find any items in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
