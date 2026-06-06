import { useRoute, Link } from "wouter";
import { CheckCircle2, ShoppingBag, ArrowRight, Clock } from "lucide-react";
import { useGetOrder, getGetOrderQueryKey } from "@/lib/api";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:id");
  const orderId = params?.id ? parseInt(params.id, 10) : null;

  const { data: order, isLoading, isError } = useGetOrder(
    orderId as number,
    {
      query: {
        enabled: !!orderId,
        queryKey: getGetOrderQueryKey(orderId as number),
      },
    }
  );

  if (!orderId) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Invalid Order</h2>
        <p className="text-muted-foreground font-sans mb-8">We couldn't find the order you're looking for.</p>
        <Link href="/"><Button>Return Home</Button></Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-8" />
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-16" />
          <div className="bg-card border border-card-border rounded-3xl p-8 space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6 text-destructive">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Order Not Found</h2>
        <p className="text-muted-foreground font-sans mb-8 max-w-md">
          There was an issue retrieving your order details.
        </p>
        <Link href="/"><Button size="lg" className="rounded-full">Return Home</Button></Link>
      </div>
    );
  }

  const subtotal = order.total;
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + gst;

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-3xl">
        <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Order Confirmed!
          </h1>
          <p className="font-sans text-lg text-muted-foreground">
            Thank you, {order.customerName}. We've received your order and are preparing it now.
          </p>
        </div>

        <div className="bg-card border border-card-border shadow-sm rounded-3xl overflow-hidden animate-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="bg-secondary/50 p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Order Number</p>
              <p className="font-mono text-xl font-bold">#{order.id.toString().padStart(5, "0")}</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="sm:text-right">
                <p className="text-sm text-muted-foreground font-medium mb-0.5">Placed on</p>
                <p className="font-sans font-medium text-foreground">
                  {format(new Date(order.createdAt), "d MMM yyyy, h:mm a")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="font-serif text-2xl font-bold mb-6">Order Details</h3>

            <div className="space-y-5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center font-sans">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">₹{item.price.toFixed(0)} each</p>
                    </div>
                  </div>
                  <div className="font-semibold">₹{(item.price * item.quantity).toFixed(0)}</div>
                </div>
              ))}
            </div>

            <Separator className="my-8" />

            <div className="space-y-4 font-sans max-w-sm ml-auto">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (5%)</span>
                <span>₹{gst.toFixed(0)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-xl font-bold text-foreground font-serif">
                <span>Total Paid</span>
                <span>₹{grandTotal.toFixed(0)}</span>
              </div>
            </div>

            {order.notes && (
              <div className="mt-8 p-4 bg-secondary/30 rounded-xl border border-border">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Notes</h4>
                <p className="text-foreground italic">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/orders">
            <Button variant="outline" className="rounded-full font-serif px-8 h-12">
              View Order History
            </Button>
          </Link>
          <Link href="/menu">
            <Button variant="ghost" className="font-serif text-lg group">
              Order Again
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
