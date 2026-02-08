import productsData from './ripped_products.json'

export interface LocalVariant {
  name: string
  options: string[]
}

export interface LocalProduct {
  id: string
  title: string
  price: string
  description: string
  images: string[]
  category: 'golf' | 'samurai' | 'shop-all' | 'other'
  variants: LocalVariant[]
}

const products: LocalProduct[] = productsData as unknown as LocalProduct[]

export function getAllLocalProducts(): LocalProduct[] {
  return products
}

export function getGolfProducts(): LocalProduct[] {
  return products.filter(p => p.category === 'golf')
}

export function getSamuraiProducts(): LocalProduct[] {
  return products.filter(p => p.category === 'samurai')
}

export function getProductById(id: string): LocalProduct | undefined {
  return products.find(p => p.id === id)
}
