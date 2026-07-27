export const SHOP_QUERY = `#graphql
  query Shop {
    shop {
      name
      primaryDomain {
        url
      }
    }
  }
`;

export interface ShopQueryData {
  shop: {
    name: string;
    primaryDomain: {
      url: string;
    };
  };
}
