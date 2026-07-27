export const COLLECTIONS_QUERY = `#graphql
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export interface CollectionsQueryData {
  collections: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        image: {
          url: string;
          altText: string | null;
        } | null;
      };
    }>;
  };
}
