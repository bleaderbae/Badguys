import { getAllProducts } from '@/lib/shopify'
import ShopClient from './ShopClient'

export const revalidate = 60

export default async function ShopPage() {
  const products = await getAllProducts()
  return <ShopClient products={products} />
}
