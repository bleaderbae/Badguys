export interface Connection<T> {
  edges: Array<{
    node: T;
  }>;
}

export interface Image {
  url: string;
  altText?: string;
}

export interface Price {
  amount: string;
  currencyCode?: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description?: string;
  priceRange?: {
    minVariantPrice: Price;
  };
  images: Connection<Image>;
  options?: Array<{
    id?: string;
    name: string;
    values: string[];
  }>;
  variants?: Connection<Variant>;
}

export interface Variant {
  id: string;
  title: string;
  availableForSale?: boolean;
  price: Price;
  image?: Image;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
  product?: {
    handle: string;
    title: string;
  };
}

export interface LineItem {
  id: string;
  title: string;
  quantity: number;
  variant?: Variant;
}

export interface Checkout {
  id: string;
  webUrl: string;
  lineItems: Connection<LineItem>;
}

export interface ProductEdge {
  node: Product;
}

export type ProductDetail = Product;

export interface CheckoutLineItemInput {
  variantId: string;
  quantity: number;
}
