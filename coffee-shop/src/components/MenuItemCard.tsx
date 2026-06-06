import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/lib/api";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAdd = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-card shadow-sm border border-card-border hover:shadow-md transition-all duration-300">
      <div className="aspect-[4/3] w-full overflow-hidden bg-secondary/50">
        <img
          src={item.imageUrl || "/images/default-coffee.png"}
          alt={item.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="font-serif text-lg font-bold text-card-foreground leading-tight">
            {item.name}
          </h3>
          <span className="font-sans font-semibold text-primary whitespace-nowrap">
            ₹{item.price.toFixed(0)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground font-sans line-clamp-2 mb-6">
          {item.description}
        </p>
        <div className="mt-auto">
          <Button
            onClick={handleAdd}
            disabled={!item.available}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            {item.available ? "Add to Cart" : "Sold Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
