import { Link } from "wouter";
import { Coffee, ShoppingBag, Menu as MenuIcon, LogOut, User, ShieldCheck, LayoutDashboard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const isAdmin = user?.isAdmin;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 md:px-8">
        <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-2 group">
          <Coffee className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Brew & Co.
          </span>
          {isAdmin && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground ml-1">
              <ShieldCheck className="h-3 w-3" /> ADMIN
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {isAdmin ? (
            <Link href="/admin" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/menu" className="text-sm font-medium hover:text-accent transition-colors">
                Our Menu
              </Link>
              <Link href="/orders" className="text-sm font-medium hover:text-accent transition-colors">
                Order History
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-accent transition-colors">
                Contact
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
            </>
          )}

          {/* User info + logout */}
          <div className="flex items-center gap-3 pl-4 border-l border-border/60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="max-w-[120px] truncate font-medium text-foreground">{user?.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center gap-4">
          {!isAdmin && (
            <Link href="/cart" className="relative p-2">
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background w-[300px] border-l border-border">
              <div className="flex flex-col gap-8 mt-12">
                {/* User greeting */}
                <div className="flex items-center gap-2 pb-4 border-b border-border">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center ${isAdmin ? "bg-primary text-primary-foreground" : "bg-primary/10"}`}>
                    {isAdmin ? <ShieldCheck className="h-5 w-5" /> : <User className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{user?.name} {isAdmin && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full ml-1">ADMIN</span>}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                {isAdmin ? (
                  <Link href="/admin" className="text-xl font-serif font-bold text-foreground">Dashboard</Link>
                ) : (
                  <>
                    <Link href="/" className="text-xl font-serif font-bold text-foreground">Home</Link>
                    <Link href="/menu" className="text-xl font-serif font-bold text-foreground">Our Menu</Link>
                    <Link href="/orders" className="text-xl font-serif font-bold text-foreground">Order History</Link>
                    <Link href="/contact" className="text-xl font-serif font-bold text-foreground">Contact</Link>
                    <Link href="/cart" className="text-xl font-serif font-bold text-foreground">Cart ({itemCount})</Link>
                  </>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-destructive font-medium text-sm mt-auto"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
