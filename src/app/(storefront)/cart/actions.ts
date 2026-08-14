"use server";

import {
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  getCart,
  type Cart,
} from "@/lib/shopify/cart";
import { getCartId, setCartId } from "@/lib/shopify/cartCookie";
import type { CartLineInput } from "@/lib/shopify/queries/cart";

export async function fetchCart(): Promise<Cart | null> {
  const cartId = await getCartId();
  if (!cartId) return null;
  return getCart(cartId);
}

export async function addToCart(lines: CartLineInput[]): Promise<Cart> {
  const cartId = await getCartId();
  // A missing cookie or a cart Shopify no longer recognizes (expired,
  // completed at checkout) both mean "start over" — addCartLines would
  // throw on the latter, so it's checked up front rather than caught.
  const existing = cartId ? await getCart(cartId) : null;

  if (!existing) {
    const cart = await createCart(lines);
    await setCartId(cart.id);
    return cart;
  }

  return addCartLines(existing.id, lines);
}

export async function updateCartLineQuantity(
  lineId: string,
  quantity: number
): Promise<Cart> {
  const cartId = await getCartId();
  if (!cartId) throw new Error("No active cart");

  if (quantity <= 0) {
    return removeCartLines(cartId, [lineId]);
  }
  return updateCartLines(cartId, [{ id: lineId, quantity }]);
}

export async function removeCartLine(lineId: string): Promise<Cart> {
  const cartId = await getCartId();
  if (!cartId) throw new Error("No active cart");
  return removeCartLines(cartId, [lineId]);
}
