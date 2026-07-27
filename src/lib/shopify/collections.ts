import "server-only";
import { shopifyFetch } from "./client";
import {
  COLLECTIONS_QUERY,
  type CollectionsQueryData,
} from "./queries/collections";

export interface Collection {
  id: string;
  title: string;
  handle: string;
  imageUrl: string | null;
  imageAlt: string | null;
}

export async function getCollections(first = 20): Promise<Collection[]> {
  const data = await shopifyFetch<CollectionsQueryData>({
    query: COLLECTIONS_QUERY,
    variables: { first },
    next: { revalidate: 3600 },
  });

  return data.collections.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    imageUrl: node.image?.url ?? null,
    imageAlt: node.image?.altText ?? null,
  }));
}
