import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ShieldCheck, Clock, ChefHat, CheckCheck, Package,
  TrendingUp, ShoppingBag, IndianRupee, RefreshCw,
} from "lucide-react";
import { useListOrders, useUpdateOrderStatus, getListOrdersQueryKey, Order } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const STATUS_FLOW: Order["status"][] = ["pending", "preparing", "ready", "delivered"];

const statusConfig: Record<Order["status"], { label: string; color: string; next?: Order["status"]; nextLabel?: string }> = {
  pending:   { label: "Pending",    color: "bg-amber-100 text-amber-700 border-amber-200",   next: "preparing", nextLabel: "Mark Preparing" },
  preparing: { label: "Preparing",  color: "bg-blue-100 text-blue-700 border-blue-200",      next: "ready",     nextLabel: "Mark Ready" },
  ready:     { label: "Ready",      color: "bg-purple-100 text-purple-700 border-purple-200", next: "delivered", nextLabel: "Mark Delivered" },
  delivered: { label: "Delivered",  color: "bg-green-100 text-green-700 border-green-200" },
};

export default function Admin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: orders = [], isLoading } = useListOrders({
    query: { queryKey: getListOrdersQueryKey(), refetchInterval: 3000 },
  });
  const updateStatus = useUpdateOrderStatus();
  const prevCountRef = useRef(orders.length);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    active: orders.filter((o) => o.status === "preparing" || o.status === "ready").length,
    revenue: orders.reduce((s, o) => s + o.total * 1.05, 0),
  };

  useEffect(() => {
    if (orders.length > prevCountRef.current) {
      const newCount = orders.length - prevCountRef.current;
      toast({
        title: `${newCount} new order${newCount > 1 ? "s" : ""} arrived!`,
        description: "Check the live feed below.",
      });
      setLastRefresh(new Date());
    }
    prevCountRef.current = orders.length;
  }, [orders.length]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "brew-co-orders") {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        setLastRefresh(new Date());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [queryClient]);

  const handleAdvance = (order: Order) => {
    const cfg = statusConfig[order.status];
    if (!cfg.next) return;
    updateStatus.mutate({ id: order.id, status: cfg.next });
  };

  return (
    <div className="min-h-screen bg-background pt-10 pb-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Live order feed · refreshes every 3s · last update {format(lastRefresh, "h:mm:ss a")}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["orders"] });
              setLastRefresh(new Date());
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Orders", value: stats.total, icon: ShoppingBag, color: "text-foreground" },
            { label: "Pending",      value: stats.pending, icon: Clock,       color: "text-amber-600" },
            { label: "In Progress",  value: stats.active,  icon: ChefHat,     color: "text-blue-600" },
            { label: "Revenue (est.)", value: null,         icon: IndianRupee, color: "text-green-600", rupee: stats.revenue },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-2">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <p className="text-2xl font-bold text-foreground font-sans">
                {s.rupee !== undefined
                  ? <><span className="font-sans">₹</span>{Math.round(s.rupee).toLocaleString("en-IN")}</>
                  : s.value}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Order feed */}
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">Live Orders</h2>

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">Loading orders…</div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-secondary/30 rounded-3xl border border-dashed border-border text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="font-serif text-xl font-bold text-foreground">No orders yet</p>
            <p className="text-muted-foreground text-sm mt-1">Orders will appear here automatically when placed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((order) => {
              const cfg = statusConfig[order.status];
              return (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        #{order.id}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="font-medium text-foreground">{order.customerName}</p>
                    {order.customerEmail && (
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(order.createdAt), "d MMM yyyy, h:mm a")}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {order.items.map((item, i) => (
                        <span
                          key={i}
                          className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                        >
                          {item.quantity}× {item.name}
                        </span>
                      ))}
                    </div>
                    {order.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">Note: {order.notes}</p>
                    )}
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
                    <p className="font-bold text-foreground font-sans text-lg">
                      <span className="font-sans">₹</span>{Math.round(order.total * 1.05).toLocaleString("en-IN")}
                    </p>
                    {cfg.next && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleAdvance(order)}
                        disabled={updateStatus.isPending}
                      >
                        {cfg.nextLabel}
                      </Button>
                    )}
                    {order.status === "delivered" && (
                      <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                        <CheckCheck className="h-3.5 w-3.5" /> Done
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
