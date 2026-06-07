import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Cart from "@/pages/cart";
import Orders from "@/pages/orders";
import OrderConfirmation from "@/pages/order-confirmation";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (user?.isAdmin) return <Redirect to="/admin" />;
  return <Component />;
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (!user?.isAdmin) return <Redirect to="/" />;
  return <Component />;
}

function Router() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated
          ? user?.isAdmin ? <Redirect to="/admin" /> : <Redirect to="/" />
          : <Login />}
      </Route>
      <Route path="/register">
        {isAuthenticated
          ? user?.isAdmin ? <Redirect to="/admin" /> : <Redirect to="/" />
          : <Register />}
      </Route>
      <Route>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Switch>
              <Route path="/"                        component={() => <ProtectedRoute component={Home} />} />
              <Route path="/menu"                    component={() => <ProtectedRoute component={Menu} />} />
              <Route path="/cart"                    component={() => <ProtectedRoute component={Cart} />} />
              <Route path="/orders"                  component={() => <ProtectedRoute component={Orders} />} />
              <Route path="/order-confirmation/:id"  component={() => <ProtectedRoute component={OrderConfirmation} />} />
              <Route path="/contact"                 component={() => <ProtectedRoute component={Contact} />} />
              <Route path="/admin"                   component={() => <AdminRoute component={Admin} />} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WouterRouter>
              <Router />
            </WouterRouter>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
