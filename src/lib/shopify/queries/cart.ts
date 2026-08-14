// Shared fragment shape for every cart query/mutation below — keeps the
// cart returned by createCart/addCartLines/updateCartLines/removeCartLines/
// getCart identical, so lib/shopify/cart.ts has one normalizer for all of
// them.
const CART_FIELDS = `#graphql
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 100) {
    nodes {
      id
      quantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          product {
            title
            handle
          }
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export interface CartQueryData {
  cart: RawCart | null;
}

export interface RawCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
  };
  lines: {
    nodes: Array<{
      id: string;
      quantity: number;
      cost: {
        totalAmount: { amount: string; currencyCode: string };
      };
      merchandise: {
        id: string;
        title: string;
        product: { title: string; handle: string };
        image: { url: string; altText: string | null } | null;
      };
    }>;
  };
}

export const CART_QUERY = `#graphql
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

export interface CartCreateMutationData {
  cartCreate: {
    cart: RawCart | null;
    userErrors: Array<{ message: string }>;
  };
}

export const CART_CREATE_MUTATION = `#graphql
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        message
      }
    }
  }
`;

export interface CartLinesAddMutationData {
  cartLinesAdd: {
    cart: RawCart | null;
    userErrors: Array<{ message: string }>;
  };
}

export const CART_LINES_ADD_MUTATION = `#graphql
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        message
      }
    }
  }
`;

export interface CartLineUpdateInput {
  id: string;
  quantity: number;
}

export interface CartLinesUpdateMutationData {
  cartLinesUpdate: {
    cart: RawCart | null;
    userErrors: Array<{ message: string }>;
  };
}

export const CART_LINES_UPDATE_MUTATION = `#graphql
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        message
      }
    }
  }
`;

export interface CartLinesRemoveMutationData {
  cartLinesRemove: {
    cart: RawCart | null;
    userErrors: Array<{ message: string }>;
  };
}

export const CART_LINES_REMOVE_MUTATION = `#graphql
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        message
      }
    }
  }
`;
