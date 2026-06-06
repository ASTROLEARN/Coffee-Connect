import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader2, Smartphone, CreditCard, Banknote, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCreateOrder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const paymentMethods = [
  {
    id: "upi",
    label: "UPI",
    description: "Pay via Google Pay, PhonePe, Paytm or any UPI app",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "Debit / Credit Card",
    description: "Visa, Mastercard, RuPay accepted",
    icon: CreditCard,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: Banknote,
  },
] as const;

type PaymentMethodId = (typeof paymentMethods)[number]["id"];

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters."),
  customerEmail: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Cart() {
  const [, setLocation] = useLocation();
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId>("upi");
  const [paymentStep, setPaymentStep] = useState(false);

  const createOrder = useCreateOrder();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      notes: "",
    },
  });

  const gst = total * 0.05;
  const grandTotal = total + gst;

  const handleProceedToPayment = form.handleSubmit(() => {
    setPaymentStep(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    const data = form.getValues();
    const orderData = {
      customerName: data.customerName,
      customerEmail: data.customerEmail || null,
      notes: `Payment: ${paymentMethods.find(p => p.id === selectedPayment)?.label}${data.notes ? ` | Notes: ${data.notes}` : ""}`,
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
    };

    createOrder.mutate({ data: orderData }, {
      onSuccess: (order) => {
        clearCart();
        toast({
          title: "Order Placed!",
          description: "Your order has been successfully placed.",
        });
        setLocation(`/order-confirmation/${order.id}`);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Order Failed",
          description: "There was a problem placing your order. Please try again.",
        });
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground font-sans mb-8 max-w-md text-center">
          Looks like you haven't added anything to your cart yet. Let's find you something delicious.
        </p>
        <Link href="/menu">
          <Button size="lg" className="rounded-full font-serif px-8 text-lg h-14">
            Browse Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4 mb-12">
          {paymentStep && (
            <Button variant="ghost" onClick={() => setPaymentStep(false)} className="p-0 h-auto font-serif text-muted-foreground hover:text-foreground">
              ← Back
            </Button>
          )}
          <h1 className="font-serif text-4xl font-bold text-foreground">
            {paymentStep ? "Choose Payment" : "Your Cart"}
          </h1>
        </div>

        {!paymentStep ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-7 space-y-6">
              {items.map((item) => (
                <div key={item.menuItemId} className="flex flex-col sm:flex-row gap-6 p-6 bg-card rounded-2xl border border-card-border shadow-sm">
                  <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                    <img
                      src={item.imageUrl || "/images/default-coffee.png"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-card-foreground mb-1">{item.name}</h3>
                        <p className="font-sans font-semibold text-primary">₹{item.price.toFixed(0)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2"
                        onClick={() => removeItem(item.menuItemId)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <div className="flex items-center border border-border rounded-full bg-background">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-sans font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="ml-auto font-serif text-lg font-bold">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary + Form */}
            <div className="lg:col-span-5">
              <div className="bg-secondary/30 rounded-3xl p-8 border border-border sticky top-28">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 font-sans">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (5%)</span>
                    <span>₹{gst.toFixed(0)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-xl font-bold text-foreground font-serif">
                    <span>Total</span>
                    <span>₹{grandTotal.toFixed(0)}</span>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={handleProceedToPayment} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-semibold">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Rahul Sharma" className="bg-background h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-semibold">Email (optional)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="rahul@example.com" className="bg-background h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans text-sm font-semibold">Order Notes (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Special requests, dietary needs..."
                              className="bg-background min-h-[80px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-full font-serif text-lg tracking-wide group"
                    >
                      Proceed to Payment
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Step */
          <div className="max-w-2xl mx-auto">
            {/* Order total recap */}
            <div className="bg-secondary/30 rounded-2xl p-6 border border-border mb-8">
              <div className="flex justify-between items-center font-sans">
                <span className="text-muted-foreground">{items.reduce((s, i) => s + i.quantity, 0)} item(s)</span>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total payable</p>
                  <p className="font-serif text-3xl font-bold text-foreground">₹{grandTotal.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">incl. 5% GST</p>
                </div>
              </div>
            </div>

            {/* Payment method cards */}
            <div className="space-y-4 mb-8">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedPayment === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full flex items-center gap-5 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-serif text-lg font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {method.label}
                      </p>
                      <p className="text-sm text-muted-foreground font-sans">{method.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "border-primary" : "border-border"
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* UPI note */}
            {selectedPayment === "upi" && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl font-sans text-sm text-muted-foreground animate-in fade-in duration-300">
                You'll be redirected to your preferred UPI app after confirming the order.
              </div>
            )}
            {selectedPayment === "card" && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl font-sans text-sm text-muted-foreground animate-in fade-in duration-300">
                Your card details are encrypted and never stored on our servers.
              </div>
            )}
            {selectedPayment === "cod" && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl font-sans text-sm text-muted-foreground animate-in fade-in duration-300">
                Please keep exact change ready. Our delivery partner will collect payment at your door.
              </div>
            )}

            <Button
              onClick={handlePlaceOrder}
              disabled={createOrder.isPending}
              className="w-full h-14 rounded-full font-serif text-lg tracking-wide group"
            >
              {createOrder.isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Confirm & Place Order
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
