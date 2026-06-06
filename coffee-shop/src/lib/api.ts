import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
  category: string;
  featured: boolean;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string | null;
  notes: string | null;
  status: "pending" | "confirmed" | "delivered";
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Signature Espresso",
    description: "A double shot of our house-blend espresso, rich and balanced with notes of dark chocolate and toasted hazelnut.",
    price: 120,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "espresso",
    featured: true,
  },
  {
    id: 2,
    name: "Flat White",
    description: "Velvety microfoam over a ristretto double shot. A Melbourne classic, done with obsessive attention to ratio.",
    price: 180,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "espresso",
    featured: true,
  },
  {
    id: 3,
    name: "Pour Over",
    description: "Single-origin Ethiopian Yirgacheffe, brewed to order. Floral, bright, with a lingering blueberry finish.",
    price: 220,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "filter",
    featured: true,
  },
  {
    id: 4,
    name: "Cardamom Cold Brew",
    description: "18-hour cold brew steeped with green cardamom pods. Smooth, spiced, and served over hand-chipped ice.",
    price: 260,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "cold",
    featured: true,
  },
  {
    id: 5,
    name: "Cortado",
    description: "Equal parts espresso and warm milk. No frills, no foam — just balance and precision in every sip.",
    price: 150,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "espresso",
    featured: false,
  },
  {
    id: 6,
    name: "Oat Milk Latte",
    description: "Our house espresso with steamed Oatly oat milk. Creamy, naturally sweet, and kind to the planet.",
    price: 200,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "espresso",
    featured: false,
  },
  {
    id: 7,
    name: "Almond Croissant",
    description: "Flaky, twice-baked croissant filled with frangipane cream and finished with toasted almond flakes.",
    price: 160,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "pastry",
    featured: false,
  },
  {
    id: 8,
    name: "Banana Bread",
    description: "Moist, dense, and warmly spiced. Made daily with overripe bananas and a touch of dark rum.",
    price: 140,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "pastry",
    featured: false,
  },
  {
    id: 9,
    name: "Matcha Latte",
    description: "Ceremonial-grade Japanese matcha whisked with steamed oat milk. Earthy, vibrant green, subtly sweet.",
    price: 210,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "tea",
    featured: false,
  },
  {
    id: 10,
    name: "Masala Chai",
    description: "A slow-brewed blend of Assam tea, fresh ginger, cardamom, cinnamon, and black pepper. Warming and bold.",
    price: 130,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "tea",
    featured: false,
  },
  {
    id: 11,
    name: "Nitro Cold Brew",
    description: "Nitrogen-infused cold brew on draft. Cascading, creamy, and intensely smooth — no ice needed.",
    price: 280,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "cold",
    featured: false,
  },
  {
    id: 12,
    name: "Whole Bean — House Blend",
    description: "Our signature blend of Brazilian Santos and Ethiopian Sidama. 250g, roasted in-house every Monday.",
    price: 550,
    imageUrl: "/images/default-coffee.png",
    available: true,
    category: "beans",
    featured: false,
  },
];

const CATEGORIES = [
  { name: "espresso", count: 4 },
  { name: "filter", count: 1 },
  { name: "cold", count: 2 },
  { name: "pastry", count: 2 },
  { name: "tea", count: 2 },
  { name: "beans", count: 1 },
];

function getStoredOrders(): Order[] {
  try {
    const stored = localStorage.getItem("brew-co-orders");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem("brew-co-orders", JSON.stringify(orders));
}

export function getGetFeaturedItemsQueryKey() {
  return ["featuredItems"] as const;
}

export function useGetFeaturedItems(options?: { query?: object }) {
  return useQuery({
    queryKey: getGetFeaturedItemsQueryKey(),
    queryFn: () => MENU_ITEMS.filter((i) => i.featured),
    ...((options as any)?.query ?? {}),
  });
}

export function getGetCategoriesQueryKey() {
  return ["categories"] as const;
}

export function useGetCategories(options?: { query?: object }) {
  return useQuery({
    queryKey: getGetCategoriesQueryKey(),
    queryFn: () => CATEGORIES,
    ...((options as any)?.query ?? {}),
  });
}

export function getListMenuItemsQueryKey(params?: { category?: string }) {
  return ["menuItems", params ?? {}] as const;
}

export function useListMenuItems(
  params?: { category?: string },
  options?: { query?: object }
) {
  return useQuery({
    queryKey: getListMenuItemsQueryKey(params),
    queryFn: () => {
      if (!params?.category) return MENU_ITEMS;
      return MENU_ITEMS.filter((i) => i.category === params.category);
    },
    ...((options as any)?.query ?? {}),
  });
}

export function getListOrdersQueryKey() {
  return ["orders"] as const;
}

export function useListOrders(options?: { query?: object }) {
  return useQuery({
    queryKey: getListOrdersQueryKey(),
    queryFn: () => getStoredOrders(),
    ...((options as any)?.query ?? {}),
  });
}

export function getGetOrderQueryKey(id: number) {
  return ["order", id] as const;
}

export function useGetOrder(id: number, options?: { query?: object }) {
  return useQuery({
    queryKey: getGetOrderQueryKey(id),
    queryFn: () => {
      const orders = getStoredOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) throw new Error("Order not found");
      return order;
    },
    ...((options as any)?.query ?? {}),
  });
}

interface CreateOrderInput {
  customerName: string;
  customerEmail?: string | null;
  notes?: string | null;
  items: Array<{ menuItemId: number; quantity: number }>;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { data: CreateOrderInput }): Promise<Order> => {
      const { data } = payload;
      const orders = getStoredOrders();

      const orderItems: OrderItem[] = data.items.map((item) => {
        const menuItem = MENU_ITEMS.find((m) => m.id === item.menuItemId);
        return {
          name: menuItem?.name ?? "Unknown Item",
          quantity: item.quantity,
          price: menuItem?.price ?? 0,
        };
      });

      const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const newOrder: Order = {
        id: Date.now(),
        customerName: data.customerName,
        customerEmail: data.customerEmail ?? null,
        notes: data.notes ?? null,
        status: "pending",
        total,
        createdAt: new Date().toISOString(),
        items: orderItems,
      };

      orders.push(newOrder);
      saveOrders(orders);
      return newOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
