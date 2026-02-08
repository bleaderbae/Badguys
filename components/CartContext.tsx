'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createCheckout, checkoutLineItemsAdd, getCheckout } from '@/lib/shopify'

type Checkout = {
  id: string
  webUrl: string
  lineItems: {
    edges: Array<{
      node: {
        id: string
        title: string
        quantity: number
        variant: {
          id: string
          price: {
            amount: string
          }
          title: string
          image: {
            url: string
            altText: string
          }
          product: {
            handle: string
            title: string
          }
        }
      }
    }>
  }
}

interface CartContextType {
  checkoutId: string | null
  checkoutUrl: string | null
  cartLines: any[] // Should be typed properly based on checkout response
  cartCount: number
  addToCart: (variantId: string, quantity: number) => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [cartLines, setCartLines] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load checkout from local storage
  useEffect(() => {
    const storedCheckoutId = localStorage.getItem('bgc_checkout_id')
    if (storedCheckoutId) {
      setCheckoutId(storedCheckoutId)
      fetchCheckout(storedCheckoutId)
    }
  }, [])

  const fetchCheckout = async (id: string) => {
    try {
      const checkout = await getCheckout(id)
      if (checkout) {
        setCheckoutId(checkout.id)
        setCheckoutUrl(checkout.webUrl)
        setCartLines(checkout.lineItems?.edges.map((edge: any) => edge.node) || [])
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

  const addToCart = async (variantId: string, quantity: number) => {
    setIsLoading(true)
    try {
      let checkout
      if (!checkoutId) {
        checkout = await createCheckout(variantId, quantity)
      } else {
        checkout = await checkoutLineItemsAdd(checkoutId, [{ variantId, quantity }])
      }

      if (checkout) {
        setCheckoutId(checkout.id)
        setCheckoutUrl(checkout.webUrl)
        setCartLines(checkout.lineItems?.edges.map((edge: any) => edge.node) || [])
        localStorage.setItem('bgc_checkout_id', checkout.id)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      // If error (e.g. checkout expired), try creating a new checkout
      if (checkoutId) {
         try {
            const newCheckout = await createCheckout(variantId, quantity)
            if (newCheckout) {
                setCheckoutId(newCheckout.id)
                setCheckoutUrl(newCheckout.webUrl)
                setCartLines(newCheckout.lineItems?.edges.map((edge: any) => edge.node) || [])
                localStorage.setItem('bgc_checkout_id', newCheckout.id)
            }
         } catch (retryError) {
             console.error('Retry failed:', retryError)
         }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const cartCount = cartLines.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider value={{ checkoutId, checkoutUrl, cartLines, cartCount, addToCart, isLoading }}>
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
