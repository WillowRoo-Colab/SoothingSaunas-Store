export const SHOP_QUERY = `#graphql
  query Shop {
    shop {
      name
      primaryDomain {
        url
      }
      brand {
        logo {
          image {
            url
            altText
          }
        }
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
    brand: {
      logo: {
        image: {
          url: string;
          altText: string | null;
        } | null;
      } | null;
    } | null;
  };
}
