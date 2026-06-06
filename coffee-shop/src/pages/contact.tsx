import { MapPin, Clock, Phone, Mail, Coffee } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Find Us
          </h1>
          <p className="font-sans text-lg text-muted-foreground">
            We'd love to see you in person. Come in, pull up a chair, and let us pour you something special.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* Info Cards */}
          <div className="space-y-6">

            <div className="flex gap-5 p-6 bg-card rounded-2xl border border-card-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-1">Address</h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  123 Roaster Avenue<br />
                  SoMa District<br />
                  San Francisco, CA 94110
                </p>
              </div>
            </div>

            <div className="flex gap-5 p-6 bg-card rounded-2xl border border-card-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2">Hours</h3>
                <div className="font-sans text-muted-foreground space-y-1">
                  <div className="flex justify-between gap-8">
                    <span>Monday – Friday</span>
                    <span className="text-foreground font-medium">7:00 am – 5:00 pm</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span>Saturday – Sunday</span>
                    <span className="text-foreground font-medium">8:00 am – 6:00 pm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-5 p-6 bg-card rounded-2xl border border-card-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-1">Phone</h3>
                <a
                  href="tel:+14155550123"
                  className="font-sans text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (415) 555-0123
                </a>
              </div>
            </div>

            <div className="flex gap-5 p-6 bg-card rounded-2xl border border-card-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-1">Email</h3>
                <a
                  href="mailto:hello@brewandco.com"
                  className="font-sans text-muted-foreground hover:text-primary transition-colors"
                >
                  hello@brewandco.com
                </a>
              </div>
            </div>

          </div>

          {/* Map placeholder + atmosphere note */}
          <div className="flex flex-col gap-6">
            <div className="relative flex-1 min-h-[320px] bg-secondary rounded-2xl border border-card-border overflow-hidden shadow-sm">
              <iframe
                title="Brew & Co. Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019!2d-122.4077!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI0JzI3LjciVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                className="w-full h-full absolute inset-0"
                style={{ border: 0, filter: "sepia(20%) contrast(95%)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="p-6 bg-foreground text-background rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Coffee className="h-5 w-5 text-accent" />
                <h3 className="font-serif text-lg font-bold">Good to know</h3>
              </div>
              <ul className="font-sans text-sm space-y-2 text-background/75">
                <li>— Street parking available on Roaster Ave & 3rd St</li>
                <li>— BART accessible — 4-min walk from Caltrain</li>
                <li>— Dog-friendly patio (weather permitting)</li>
                <li>— Free Wi-Fi for dine-in guests</li>
                <li>— Whole beans available for pickup — roasted every Monday</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
