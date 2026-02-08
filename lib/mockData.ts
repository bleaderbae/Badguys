import { Product, ProductDetail } from './types'

// Helper to create a mock product node
const createProductNode = (
  id: string,
  title: string,
  handle: string,
  price: string,
  imageUrl: string
): Product => ({
  node: {
    id,
    title,
    handle,
    priceRange: {
      minVariantPrice: {
        amount: price,
      },
    },
    images: {
      edges: [
        {
          node: {
            url: imageUrl,
            altText: title,
          },
        },
      ],
    },
  },
})

// Mock Shop Products (based on ripped data + QA item)
export const MOCK_SHOP_PRODUCTS: Product[] = [
  createProductNode(
    'gid://shopify/Product/qa-test-product',
    'QA Test Product',
    'qa-test-product',
    '10.00',
    'https://via.placeholder.com/600x600/ff0000/ffffff?text=QA+Product'
  ),
  createProductNode(
    'gid://shopify/Product/golf-polo',
    'Bad Guys Club Golf Polo',
    'golf-polo',
    '80.33',
    'https://bgc.gg/wp-content/uploads/2025/08/8972961013069467438_2048_custom.jpeg'
  ),
  createProductNode(
    'gid://shopify/Product/samurai-tee',
    'Bad Guy Samurai Hang Loose',
    'samurai-tee',
    '30.00',
    'https://bgc.gg/wp-content/uploads/2025/01/14367947741079445332_2048-3.jpeg'
  ),
]

// Mock Card Products
export const MOCK_CARD_PRODUCTS: Product[] = [
  // Include QA Test Product in the Vault/Cards view
  createProductNode(
    'gid://shopify/Product/qa-test-product',
    'QA Test Product',
    'qa-test-product',
    '10.00',
    'https://via.placeholder.com/600x600/ff0000/ffffff?text=QA+Product'
  ),
  createProductNode(
    'gid://shopify/Product/card-charizard',
    'Charizard Base Set',
    'card-charizard',
    '500.00',
    'https://via.placeholder.com/600x800/ff9900/000000?text=Charizard'
  ),
  createProductNode(
    'gid://shopify/Product/card-lotus',
    'Black Lotus',
    'card-lotus',
    '25000.00',
    'https://via.placeholder.com/600x800/000000/ffffff?text=Black+Lotus'
  ),
  createProductNode(
    'gid://shopify/Product/card-blue-eyes',
    'Blue-Eyes White Dragon',
    'card-blue-eyes',
    '150.00',
    'https://via.placeholder.com/600x800/ffffff/000000?text=Blue+Eyes'
  ),
]

// Mock Product Details (for individual product pages)
export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetail> = {
  'qa-test-product': {
    id: 'gid://shopify/Product/qa-test-product',
    title: 'QA Test Product',
    handle: 'qa-test-product',
    description: 'A dedicated product for QA testing cart functionality.',
    images: {
      edges: [
        {
          node: {
            url: 'https://via.placeholder.com/600x600/ff0000/ffffff?text=QA+Red',
            altText: 'QA Product Red',
          },
        },
        {
          node: {
            url: 'https://via.placeholder.com/600x600/0000ff/ffffff?text=QA+Blue',
            altText: 'QA Product Blue',
          },
        },
      ],
    },
    options: [
      {
        id: 'opt-color',
        name: 'Color',
        values: ['Red', 'Blue'],
      },
    ],
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/qa-red',
            title: 'Red',
            availableForSale: true,
            price: { amount: '10.00' },
            image: {
              url: 'https://via.placeholder.com/600x600/ff0000/ffffff?text=QA+Red',
              altText: 'QA Product Red',
            },
            selectedOptions: [{ name: 'Color', value: 'Red' }],
          },
        },
        {
          node: {
            id: 'gid://shopify/ProductVariant/qa-blue',
            title: 'Blue',
            availableForSale: true,
            price: { amount: '10.00' },
            image: {
              url: 'https://via.placeholder.com/600x600/0000ff/ffffff?text=QA+Blue',
              altText: 'QA Product Blue',
            },
            selectedOptions: [{ name: 'Color', value: 'Blue' }],
          },
        },
      ],
    },
  },
  // We can add more details for other products if needed, but the QA one is critical.
  'golf-polo': {
    id: 'gid://shopify/Product/golf-polo',
    title: 'Bad Guys Club Golf Polo',
    handle: 'golf-polo',
    description: 'Elevate your casual wardrobe with this stylish Performance Polo.',
    images: {
        edges: [
            { node: { url: 'https://bgc.gg/wp-content/uploads/2025/08/8972961013069467438_2048_custom.jpeg', altText: 'Golf Polo' } },
            { node: { url: 'https://bgc.gg/wp-content/uploads/2025/08/18287330513543718971_2048.jpeg', altText: 'Golf Polo Back' } }
        ]
    },
    options: [{ id: 'opt-color', name: 'Color', values: ['Grey', 'Black'] }],
    variants: {
        edges: [
            {
                node: {
                    id: 'gid://shopify/ProductVariant/polo-grey',
                    title: 'Grey',
                    availableForSale: true,
                    price: { amount: '80.33' },
                    image: { url: 'https://bgc.gg/wp-content/uploads/2025/08/8972961013069467438_2048_custom.jpeg', altText: 'Grey' },
                    selectedOptions: [{ name: 'Color', value: 'Grey' }]
                }
            },
            {
                node: {
                    id: 'gid://shopify/ProductVariant/polo-black',
                    title: 'Black',
                    availableForSale: true,
                    price: { amount: '80.33' },
                    image: { url: 'https://bgc.gg/wp-content/uploads/2025/08/18287330513543718971_2048.jpeg', altText: 'Black' },
                    selectedOptions: [{ name: 'Color', value: 'Black' }]
                }
            }
        ]
    }
  }
}
