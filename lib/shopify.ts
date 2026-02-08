import { MOCK_SHOP_PRODUCTS, MOCK_PRODUCT_DETAILS, MOCK_CARD_PRODUCTS } from './mockData'

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

const DEFAULT_PRODUCT_LIMIT = 25

async function ShopifyData(query: string, variables?: Record<string, any>) {
  const URL = `https://${domain}/api/2024-01/graphql.json`

  const body: { query: string; variables?: Record<string, any> } = { query }
  if (variables) {
    body.variables = variables
  }

  const options = {
    endpoint: URL,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken!,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }

  try {
    const data = await fetch(URL, options).then(response => {
      return response.json()
    })

    return data
  } catch (error) {
    throw new Error("Products not fetched")
  }
}

export async function getAllProducts(limit: number = DEFAULT_PRODUCT_LIMIT) {
  const query = `
  query products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }`

  try {
    const response = await ShopifyData(query, { first: limit })
    const allProducts = response.data.products.edges ? response.data.products.edges : []
    if (allProducts.length === 0) return MOCK_SHOP_PRODUCTS
    return allProducts
  } catch (error) {
    console.warn("Error fetching products, using mock data:", error)
    return MOCK_SHOP_PRODUCTS
  }
}

export async function getCardProducts() {
  return MOCK_CARD_PRODUCTS
}

export async function getProduct(handle: string) {
  if (MOCK_PRODUCT_DETAILS[handle]) {
    return MOCK_PRODUCT_DETAILS[handle]
  }

  const query = `
  query product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      options {
        name
        values
        id
      }
      variants(first: 25) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
            }
            image {
              url
              altText
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }`

  try {
    const response = await ShopifyData(query, { handle })
    const product = response.data.product ? response.data.product : null
    return product
  } catch (error) {
    console.warn("Error fetching product, returning null:", error)
    return null
  }
}

export async function createCheckout(id: string, quantity: number) {
  const query = `
    mutation checkoutCreate($variantId: ID!, $quantity: Int!) {
      checkoutCreate(input: {
        lineItems: [{ variantId: $variantId, quantity: $quantity }]
      }) {
        checkout {
          id
          webUrl
          lineItems(first: 25) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  price {
                    amount
                  }
                  title
                  image {
                    url
                    altText
                  }
                  product {
                    handle
                    title
                  }
                }
              }
            }
          }
        }
      }
    }`

  const response = await ShopifyData(query, { variantId: id, quantity })

  const checkout = response.data.checkoutCreate.checkout ? response.data.checkoutCreate.checkout : []

  return checkout
}

export async function checkoutLineItemsAdd(checkoutId: string, lineItems: { variantId: string; quantity: number }[]) {
  const query = `
    mutation checkoutLineItemsAdd($lineItems: [CheckoutLineItemInput!]!, $checkoutId: ID!) {
      checkoutLineItemsAdd(lineItems: $lineItems, checkoutId: $checkoutId) {
        checkout {
          id
          webUrl
          lineItems(first: 25) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  price {
                    amount
                  }
                  title
                  image {
                    url
                    altText
                  }
                  product {
                    handle
                    title
                  }
                }
              }
            }
          }
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }`

  const response = await ShopifyData(query, {
    checkoutId,
    lineItems,
  })

  const checkout = response.data.checkoutLineItemsAdd.checkout ? response.data.checkoutLineItemsAdd.checkout : []

  return checkout
}

export async function getCheckout(checkoutId: string) {
  const query = `
  query checkout($checkoutId: ID!) {
    node(id: $checkoutId) {
      ... on Checkout {
        id
        webUrl
        lineItems(first: 25) {
          edges {
            node {
              id
              title
              quantity
              variant {
                id
                price {
                  amount
                }
                title
                image {
                  url
                  altText
                }
                product {
                  handle
                  title
                }
              }
            }
          }
        }
      }
    }
  }`

  const response = await ShopifyData(query, { checkoutId })

  return response.data ? response.data.node : null
}

export interface UpdateCheckoutLineItem {
  id: string;
  variantQuantity: number;
}

export async function updateCheckout(id: string, lineItems: UpdateCheckoutLineItem[]) {
  const formattedLineItems = lineItems.map((item) => {
    return {
      variantId: item.id,
      quantity: item.variantQuantity
    }
  })

  const query = `
    mutation checkoutLineItemsReplace($lineItems: [CheckoutLineItemInput!]!, $checkoutId: ID!) {
      checkoutLineItemsReplace(lineItems: $lineItems, checkoutId: $checkoutId) {
        checkout {
          id
          webUrl
          lineItems(first: 25) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  price {
                    amount
                  }
                  title
                  image {
                    url
                    altText
                  }
                  product {
                    handle
                    title
                  }
                }
              }
            }
          }
        }
      }
    }`

  const response = await ShopifyData(query, {
    lineItems: formattedLineItems,
    checkoutId: id,
  })

  const checkout = response.data.checkoutLineItemsReplace.checkout ? response.data.checkoutLineItemsReplace.checkout : []

  return checkout
}
