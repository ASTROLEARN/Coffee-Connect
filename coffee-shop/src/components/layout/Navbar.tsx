import { Link } from "wouter";
import { Coffee, ShoppingBag, Menu as MenuIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { itemCount } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Coffee className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Brew & Co.
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/menu" className="text-sm font-medium hover:text-accent transition-colors">
            Our Menu
          </Link>
          <Link href="/orders" className="text-sm font-medium hover:text-accent transition-colors">
            Order History
          </Link>
          <Link href="/cart" className="relative text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden lg:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/cart" className="relative p-2">
            <ShoppingBag className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background w-[300px] border-l border-border">
              <div className="flex flex-col gap-8 mt-12">
                <Link href="/" className="text-xl font-serif font-bold text-foreground">Home</Link>
                <Link href="/menu" className="text-xl font-serif font-bold text-foreground">Our Menu</Link>
                <Link href="/orders" className="text-xl font-serif font-bold text-foreground">Order History</Link>
                <Link href="/cart" className="text-xl font-serif font-bold text-foreground">Cart ({itemCount})</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
