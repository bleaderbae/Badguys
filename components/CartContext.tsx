'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createCheckout, checkoutLineItemsAdd, getCheckout, checkoutLineItemsRemove } from '@/lib/shopify'
import { MOCK_PRODUCT_DETAILS } from '@/lib/mockData'
import { LineItem, Variant, ProductDetail } from '@/lib/types'

interface CartContextType {
  checkoutId: string | null
  checkoutUrl: string | null
  cartLines: LineItem[]
  cartCount: number
  addToCart: (variantId: string, quantity: number) => Promise<void>
  removeFromCart: (lineItemId: string) => Promise<void>
  isLoading: boolean
  isInitializing: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [cartLines, setCartLines] = useState<LineItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Load checkout from local storage
  useEffect(() => {
    const initializeCart = async () => {
      const storedCheckoutId = localStorage.getItem('bgc_checkout_id')
      if (storedCheckoutId) {
        setCheckoutId(storedCheckoutId)
        await fetchCheckout(storedCheckoutId)
      } else {
          // Load local mock cart
          const localCart = localStorage.getItem('bgc_local_cart')
          if (localCart) {
              try {
                  setCartLines(JSON.parse(localCart))
              } catch (e) {
                  console.error('Error parsing local cart', e)
              }
          }
      }
      setIsInitializing(false)
    }

    initializeCart()
  }, [])

  const fetchCheckout = async (id: string) => {
    try {
      const checkout = await getCheckout(id)
      if (checkout) {
        setCheckoutId(checkout.id)
        setCheckoutUrl(checkout.webUrl)
        setCartLines(checkout.lineItems?.edges.map((edge) => edge.node) || [])
      } else {
        // Checkout expired or invalid
        localStorage.removeItem('bgc_checkout_id')
        setCheckoutId(null)
      }
    } catch (error) {
      console.error('Error fetching checkout:', error)
      localStorage.removeItem('bgc_checkout_id')
      setCheckoutId(null)
    }
  }

  const addToLocalCart = (variantId: string, quantity: number) => {
      // Find variant in mocks
      let foundVariant: Variant | null = null;
      let foundProduct: ProductDetail | null = null;

      for (const handle in MOCK_PRODUCT_DETAILS) {
          const product = MOCK_PRODUCT_DETAILS[handle];
          const variant = product.variants?.edges.find(e => e.node.id === variantId)?.node;
          if (variant) {
              foundVariant = variant;
              foundProduct = product;
              break;
          }
      }

      if (foundVariant && foundProduct) {
          setCartLines(prev => {
              const existingIndex = prev.findIndex(item => item.variant?.id === variantId);
              let newLines;
              if (existingIndex > -1) {
                  newLines = [...prev];
                  newLines[existingIndex] = {
                      ...newLines[existingIndex],
                      quantity: newLines[existingIndex].quantity + quantity
                  };
              } else {
                   const newItem = {
                      id: `line_${Date.now()}`,
                      title: foundProduct.title,
                      quantity: quantity,
                      variant: {
                          id: foundVariant.id,
                          price: foundVariant.price,
                          title: foundVariant.title,
                          image: foundVariant.image,
                          product: {
                              handle: foundProduct.handle,
                              title: foundProduct.title
                          }
                      }
                  };
                  newLines = [...prev, newItem];
              }
              localStorage.setItem('bgc_local_cart', JSON.stringify(newLines));
              return newLines;
          });
      }
  }

  const removeFromLocalCart = (lineItemId: string) => {
      setCartLines(prev => {
          const newLines = prev.filter(item => item.id !== lineItemId);
          localStorage.setItem('bgc_local_cart', JSON.stringify(newLines));
          return newLines;
      });
  }

  const addToCart = async (variantId: string, quantity: number) => {
    setIsLoading(true)
    try {
      // Attempt Shopify cart first
      let checkout
      try {
        if (!checkoutId) {
            checkout = await createCheckout(variantId, quantity)
        } else {
            checkout = await checkoutLineItemsAdd(checkoutId, [{ variantId, quantity }])
        }
      } catch (shopifyError) {
        console.warn('Shopify cart failed, falling back to local mock cart', shopifyError)
        // Fallback to local
        addToLocalCart(variantId, quantity)
        return; // Exit after local add
      }

      if (checkout) {
        setCheckoutId(checkout.id)
        setCheckoutUrl(checkout.webUrl)
        setCartLines(checkout.lineItems?.edges.map((edge) => edge.node) || [])
        localStorage.setItem('bgc_checkout_id', checkout.id)
      } else {
         // If checkout returned null/empty but no error thrown
         addToLocalCart(variantId, quantity)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      addToLocalCart(variantId, quantity)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (lineItemId: string) => {
    setIsLoading(true)
    try {
        if (checkoutId) {
            try {
                const checkout = await checkoutLineItemsRemove(checkoutId, [lineItemId])
                if (checkout) {
                    setCheckoutId(checkout.id)
                    setCheckoutUrl(checkout.webUrl)
                    setCartLines(checkout.lineItems?.edges.map((edge) => edge.node) || [])
                    localStorage.setItem('bgc_checkout_id', checkout.id)
                    return
                }
            } catch (shopifyError) {
                console.warn('Shopify remove failed, trying local', shopifyError)
            }
        }
        // Fallback to local removal if checkoutId is null or API fails
        removeFromLocalCart(lineItemId)
    } catch (error) {
        console.error('Error removing from cart:', error)
        removeFromLocalCart(lineItemId)
    } finally {
        setIsLoading(false)
    }
  }

  const cartCount = cartLines.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider value={{ checkoutId, checkoutUrl, cartLines, cartCount, addToCart, removeFromCart, isLoading, isInitializing }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
