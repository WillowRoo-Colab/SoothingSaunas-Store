import "server-only";
import { cookies } from "next/headers";

const CART_COOKIE = "ss_cart_id";
// 30 days — Shopify carts themselves expire after ~10 days of inactivity;
// this just needs to comfortably outlive that so a stale id is discovered
// via getCart() returning null rather than the cookie expiring first.
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function getCartId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

export async function setCartId(cartId: string): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, cartId, {
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function clearCartId(): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, "", { path: "/", maxAge: 0 });
}
