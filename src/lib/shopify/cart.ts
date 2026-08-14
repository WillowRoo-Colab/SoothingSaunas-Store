import "server-only";
import { shopifyFetch } from "./client";
import {
  CART_QUERY,
  type CartQueryData,
  CART_CREATE_MUTATION,
  type CartCreateMutationData,
  CART_LINES_ADD_MUTATION,
  type CartLinesAddMutationData,
  CART_LINES_UPDATE_MUTATION,
  type CartLinesUpdateMutationData,
  CART_LINES_REMOVE_MUTATION,
  type CartLinesRemoveMutationData,
  type CartLineInput,
  type CartLineUpdateInput,
  type RawCart,
} from "./queries/cart";

// SSES-006: Shopify is the system of record for cart state — this module
// only translates the Storefront API's cart shape into what the drawer
// renders and forwards mutations. Nothing here holds cart data on its own;
// the cart id cookie (src/lib/shopify/cartCookie.ts) is the only thing the
// storefront persists.

export interface CartLine {
  id: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  productTitle: string;
  productHandle: string;
  imageUrl: string | null;
  imageAlt: string | null;
  lineTotal: string;
  currencyCode: string;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: string;
  currencyCode: string;
  lines: CartLine[];
}

function normalizeCart(raw: RawCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    subtotal: raw.cost.subtotalAmount.amount,
    currencyCode: raw.cost.subtotalAmount.currencyCode,
    lines: raw.lines.nodes.map((line) => ({
      id: line.id,
      quantity: line.quantity,
      variantId: line.merchandise.id,
      // Shopify names a product's only variant "Default Title" when it has
      // no real option combinations — not something a guest should see.
      variantTitle:
        line.merchandise.title === "Default Title" ? "" : line.merchandise.title,
      productTitle: line.merchandise.product.title,
      productHandle: line.merchandise.product.handle,
      imageUrl: line.merchandise.image?.url ?? null,
      imageAlt: line.merchandise.image?.altText ?? null,
      lineTotal: line.cost.totalAmount.amount,
      currencyCode: line.cost.totalAmount.currencyCode,
    })),
  };
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<CartQueryData>({
    query: CART_QUERY,
    variables: { cartId },
  });

  return data.cart ? normalizeCart(data.cart) : null;
}

export async function createCart(lines: CartLineInput[]): Promise<Cart> {
  const data = await shopifyFetch<CartCreateMutationData, { lines: CartLineInput[] }>({
    query: CART_CREATE_MUTATION,
    variables: { lines },
  });

  const { cart, userErrors } = data.cartCreate;
  if (!cart) throw new Error(userErrors[0]?.message ?? "Failed to create cart");
  return normalizeCart(cart);
}

export async function addCartLines(
  cartId: string,
  lines: CartLineInput[]
): Promise<Cart> {
  const data = await shopifyFetch<
    CartLinesAddMutationData,
    { cartId: string; lines: CartLineInput[] }
  >({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
  });

  const { cart, userErrors } = data.cartLinesAdd;
  if (!cart) throw new Error(userErrors[0]?.message ?? "Failed to add to cart");
  return normalizeCart(cart);
}

export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<Cart> {
  const data = await shopifyFetch<
    CartLinesUpdateMutationData,
    { cartId: string; lines: CartLineUpdateInput[] }
  >({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
  });

  const { cart, userErrors } = data.cartLinesUpdate;
  if (!cart) throw new Error(userErrors[0]?.message ?? "Failed to update cart");
  return normalizeCart(cart);
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = await shopifyFetch<
    CartLinesRemoveMutationData,
    { cartId: string; lineIds: string[] }
  >({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
  });

  const { cart, userErrors } = data.cartLinesRemove;
  if (!cart) throw new Error(userErrors[0]?.message ?? "Failed to update cart");
  return normalizeCart(cart);
}
