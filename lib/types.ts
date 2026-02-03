export interface Product {
  node: {
    id: string
    title: string
    handle: string
    priceRange: {
      minVariantPrice: {
        amount: string
      }
    }
    images: {
      edges: Array<{
        node: {
          url: string
          altText: string
        }
      }>
    }
  }
}

export interface ProductDetail {
  id: string
  title: string
  handle: string
  description: string
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string
      }
    }>
  }
  options: Array<{
    name: string
    values: string[]
    id: string
  }>
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        availableForSale: boolean
        price: {
          amount: string
        }
        selectedOptions: Array<{
          name: string
          value: string
        }>
      }
    }>
  }
}

export interface CartItem {
  id: string
  title: string
  handle: string
  image: string
  price: string
  variantQuantity: number
}
