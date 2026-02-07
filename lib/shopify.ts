const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

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

export async function getProductsInCollection() {
  const query = `
  {
    products(first: 25) {
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

  const response = await ShopifyData(query)

  const allProducts = response.data.products.edges ? response.data.products.edges : []

  return allProducts
}

export async function getAllProducts() {
  const query = `
  {
    products(first: 25) {
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

  const response = await ShopifyData(query)

  const allProducts = response.data.products.edges ? response.data.products.edges : []

  return allProducts
}

export async function getProduct(handle: string) {
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
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }`

  const response = await ShopifyData(query, { handle })

  const product = response.data.product ? response.data.product : []

  return product
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
        }
      }
    }`

  const response = await ShopifyData(query, { variantId: id, quantity })

  const checkout = response.data.checkoutCreate.checkout ? response.data.checkoutCreate.checkout : []

  return checkout
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
