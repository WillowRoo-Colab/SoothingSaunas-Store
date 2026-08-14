"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import type { Cart } from "@/lib/shopify/cart";
import type { CartLineInput } from "@/lib/shopify/queries/cart";
import {
  addToCart,
  updateCartLineQuantity,
  removeCartLine,
} from "@/app/(storefront)/cart/actions";
import { CartDrawer } from "./CartDrawer";

interface CartContextValue {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItems: (lines: CartLineInput[]) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const GENERIC_ERROR = "Something went wrong. Please try again.";

export function CartProvider({
  initialCart,
  children,
}: {
  initialCart: Cart | null;
  children: ReactNode;
}) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const addItems = useCallback((lines: CartLineInput[]) => {
    setError(null);
    startTransition(async () => {
      try {
        const updated = await addToCart(lines);
        setCart(updated);
        setIsOpen(true);
      } catch {
        setError(GENERIC_ERROR);
      }
    });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setError(null);
    startTransition(async () => {
      try {
        const updated = await updateCartLineQuantity(lineId, quantity);
        setCart(updated);
      } catch {
        setError(GENERIC_ERROR);
      }
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setError(null);
    startTransition(async () => {
      try {
        const updated = await removeCartLine(lineId);
        setCart(updated);
      } catch {
        setError(GENERIC_ERROR);
      }
    });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isPending,
        error,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItems,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
