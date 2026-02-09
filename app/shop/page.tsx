import { getAllProducts, getShopInfo } from '@/lib/shopify'
import ShopClient from './ShopClient'

export const revalidate = 60

export default async function ShopPage() {
  const products = await getAllProducts()
  const shopInfo = await getShopInfo()
  return <ShopClient products={products} shopInfo={shopInfo} />
}
