import { MOCK_SHOP_PRODUCTS, MOCK_PRODUCT_DETAILS, MOCK_CARD_PRODUCTS } from './mockData'
import { Checkout, ProductEdge, Product, CheckoutLineItemInput } from './types'

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

const DEFAULT_PRODUCT_LIMIT = 25
const MAX_QUANTITY = 10000

function validateQuantity(quantity: number) {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0")
  }
  if (quantity > MAX_QUANTITY) {
    throw new Error("Quantity exceeds maximum limit")
  }
}

export async function ShopifyData(query: string, variables?: Record<string, any>) {
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

export async function getAllProducts(limit: number = DEFAULT_PRODUCT_LIMIT): Promise<ProductEdge[]> {
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

export async function getCardProducts(): Promise<ProductEdge[]> {
  return MOCK_CARD_PRODUCTS
}

export async function getProduct(handle: string): Promise<Product | null> {
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

export async function createCheckout(id: string, quantity: number): Promise<Checkout | null> {
  validateQuantity(quantity)

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

  const checkout = response.data.checkoutCreate.checkout ? response.data.checkoutCreate.checkout : null

  return checkout
}

export async function getShopInfo() {
  const query = `
    query shopInfo {
      shop {
        name
        description
      }
    }
  `

  try {
    const response = await ShopifyData(query)
    return response.data.shop ? response.data.shop : { name: 'Bad Guys Club', description: 'The lifestyle brand for modern bad guys' }
  } catch (error) {
    console.warn("Error fetching shop info:", error)
    return { name: 'Bad Guys Club', description: 'The lifestyle brand for modern bad guys' }
  }
}

export async function customerAccessTokenCreate(email: string, password: string) {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `

  const response = await ShopifyData(query, {
    input: { email, password }
  })

  return response.data.customerAccessTokenCreate
}

export async function customerCreate(email: string, password: string, firstName?: string, lastName?: string) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `

  const response = await ShopifyData(query, {
    input: { email, password, firstName, lastName }
  })

  return response.data.customerCreate
}

export async function getCustomer(accessToken: string) {
  const query = `
    query customer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        defaultAddress {
          id
          address1
          address2
          city
          province
          zip
          country
        }
        orders(first: 10) {
          edges {
            node {
              id
              orderNumber
              totalPrice {
                amount
                currencyCode
              }
              processedAt
              financialStatus
              fulfillmentStatus
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const response = await ShopifyData(query, {
    customerAccessToken: accessToken
  })

  return response.data.customer
}

export async function customerRecover(email: string) {
  const query = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `

  const response = await ShopifyData(query, { email })

  return response.data.customerRecover
}

export async function checkoutLineItemsAdd(checkoutId: string, lineItems: CheckoutLineItemInput[]): Promise<Checkout | null> {
  lineItems.forEach(item => validateQuantity(item.quantity))

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

  const checkout = response.data.checkoutLineItemsAdd.checkout ? response.data.checkoutLineItemsAdd.checkout : null

  return checkout
}

export async function getCheckout(checkoutId: string): Promise<Checkout | null> {
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

export async function updateCheckout(id: string, lineItems: UpdateCheckoutLineItem[]): Promise<Checkout | null> {
  lineItems.forEach(item => validateQuantity(item.variantQuantity))

  const formattedLineItems: CheckoutLineItemInput[] = lineItems.map((item) => {
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

  const checkout = response.data.checkoutLineItemsReplace.checkout ? response.data.checkoutLineItemsReplace.checkout : null

  return checkout
}

export async function checkoutLineItemsRemove(checkoutId: string, lineItemIds: string[]): Promise<Checkout | null> {
  const query = `
    mutation checkoutLineItemsRemove($checkoutId: ID!, $lineItemIds: [ID!]!) {
      checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
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
    lineItemIds,
  })

  const checkout = response.data.checkoutLineItemsRemove.checkout ? response.data.checkoutLineItemsRemove.checkout : null

  return checkout
}
