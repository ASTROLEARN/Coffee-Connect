import { Link } from "wouter";
import { ArrowRight, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetFeaturedItems, getGetFeaturedItemsQueryKey } from "@/lib/api";
import { MenuItemCard } from "@/components/MenuItemCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredItems, isLoading } = useGetFeaturedItems({
    query: { queryKey: getGetFeaturedItemsQueryKey() }
  });

  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-foreground">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.png"
            alt="Brew & Co Interior"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent mix-blend-multiply" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 text-center text-background">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Crafted with <br className="hidden sm:block" />
            <span className="text-accent italic">Intention.</span>
          </h1>
          <p className="font-sans text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Experience the warmth of a neighborhood café, delivered right to your door. Rich espresso, artisanal pastries, and moments of quiet confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/menu">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-serif font-bold tracking-wide">
                Order Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToAbout}
              className="w-full sm:w-auto text-lg h-14 px-8 border-background/20 text-background hover:bg-background/10 rounded-full font-serif tracking-wide bg-transparent backdrop-blur-sm"
            >
              Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Seasonal Signatures</h2>
              <p className="text-muted-foreground font-sans text-lg max-w-xl">
                Curated roasts and limited-time beverages, crafted to perfection.
              </p>
            </div>
            <Link href="/menu">
              <Button variant="ghost" className="group font-serif text-primary hover:text-accent hover:bg-transparent px-0">
                View Full Menu
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredItems?.slice(0, 4).map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/about.png"
                alt="Barista pouring coffee"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground">
                The Art of the <br className="hidden md:block" /> Perfect Pour.
              </h2>
              <div className="space-y-6 text-lg font-sans text-muted-foreground">
                <p>
                  At Brew & Co., we believe that coffee is more than a beverage — it's a ritual. A moment of pause in a chaotic world.
                </p>
                <p>
                  We source our beans from sustainable, ethical farms across the globe, roasting them in small batches to bring out their unique, nuanced flavor profiles.
                </p>
                <p>
                  Whether it's a bold, dark espresso to start your morning or a delicate, floral pour-over for a quiet afternoon, every cup is crafted with obsessive attention to detail.
                </p>
              </div>
              <div className="mt-10">
                <Link href="/menu">
                  <Button className="h-14 px-8 bg-foreground text-background hover:bg-foreground/90 rounded-full font-serif tracking-wide text-lg group">
                    Taste the Difference
                    <ArrowRightCircle className="ml-3 h-5 w-5 group-hover:rotate-45 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
