import "server-only";
import { shopifyFetch } from "./client";
import { SHOP_QUERY, type ShopQueryData } from "./queries/shop";

export async function getShop() {
  const data = await shopifyFetch<ShopQueryData>({
    query: SHOP_QUERY,
    next: { revalidate: 3600 },
  });
  return data.shop;
}
