import { Coffee } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Coffee className="h-6 w-6 text-accent" />
            <span className="font-serif text-2xl font-bold tracking-tight">
              Brew & Co.
            </span>
          </div>
          <p className="text-muted-foreground max-w-sm font-sans leading-relaxed">
            Crafting exceptional coffee experiences daily. Warm, inviting, artisanal, and confident. Like the smell of freshly ground beans in a sunlit space.
          </p>
        </div>
        
        <div>
          <h4 className="font-serif text-lg font-semibold mb-6">Location</h4>
          <address className="not-italic text-muted-foreground font-sans space-y-2">
            <p>123 Roaster Avenue</p>
            <p>San Francisco, CA 94110</p>
          </address>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold mb-6">Hours</h4>
          <ul className="text-muted-foreground font-sans space-y-2">
            <li>Mon-Fri: 7am - 5pm</li>
            <li>Sat-Sun: 8am - 6pm</li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 mt-16 pt-8 border-t border-muted/20">
        <p className="text-muted-foreground text-sm font-sans text-center">
          &copy; {new Date().getFullYear()} Brew & Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
