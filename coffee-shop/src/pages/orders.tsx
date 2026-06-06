import { Link } from "wouter";
import { ClipboardList, ArrowRight, Clock, CheckCircle2, Package } from "lucide-react";
import { useListOrders, getListOrdersQueryKey } from "@/lib/api";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Preparing", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle2 },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700 border-green-200", icon: Package },
};

export default function Orders() {
  const { data: orders, isLoading } = useListOrders({
    query: { queryKey: getListOrdersQueryKey() },
  });

  const sortedOrders = orders ? [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) : [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Order History</h1>
          <p className="text-muted-foreground font-sans text-lg">
            All your past orders from Brew & Co.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-secondary/30 rounded-3xl border border-border border-dashed text-center px-4">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
              <ClipboardList className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">No orders yet</h2>
            <p className="text-muted-foreground font-sans mb-8 max-w-md">
              You haven't placed any orders yet. Browse our menu and treat yourself!
            </p>
            <Link href="/menu">
              <Button size="lg" className="rounded-full font-serif px-8 h-14">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedOrders.map((order) => {
              const status = statusConfig[order.status] ?? statusConfig.pending;
              const StatusIcon = status.icon;
              const subtotal = order.total;
              const grandTotal = subtotal * 1.05;

              return (
                <Link key={order.id} href={`/order-confirmation/${order.id}`}>
                  <div className="bg-card border border-card-border rounded-2xl p-6 hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-lg font-bold text-foreground">
                          #{order.id.toString().padStart(5, "0")}
                        </p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-sans">
                        {format(new Date(order.createdAt), "d MMM yyyy, h:mm a")}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {order.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-secondary rounded-full text-sm font-sans text-secondary-foreground"
                        >
                          {item.quantity}× {item.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="font-sans">
                        <span className="text-muted-foreground text-sm">Total paid  </span>
                        <span className="font-serif text-xl font-bold text-foreground">₹{grandTotal.toFixed(0)}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="group-hover:text-primary font-sans">
                        View details
                        <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
