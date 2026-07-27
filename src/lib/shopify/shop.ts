import "server-only";
import { shopifyFetch } from "./client";
import { SHOP_QUERY, type ShopQueryData } from "./queries/shop";

export interface Shop {
  name: string;
  url: string;
  logoUrl: string | null;
  logoAlt: string | null;
}

export async function getShop(): Promise<Shop> {
  const data = await shopifyFetch<ShopQueryData>({
    query: SHOP_QUERY,
    next: { revalidate: 3600 },
  });

  return {
    name: data.shop.name,
    url: data.shop.primaryDomain.url,
    logoUrl: data.shop.brand?.logo?.image?.url ?? null,
    logoAlt: data.shop.brand?.logo?.image?.altText ?? data.shop.name,
  };
}
