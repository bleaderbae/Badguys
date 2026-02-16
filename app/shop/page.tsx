import { getAllProducts, getShopInfo } from '@/lib/shopify'
import ShopClient from './ShopClient'

export const revalidate = 60

export default async function ShopPage() {
  // Optimization: Fetch products and shop info in parallel.
  // This reduces the server response time by overlapping the network requests.
  // Expected impact: ~50% reduction in data fetching time if both requests take similar time.
  const [products, shopInfo] = await Promise.all([
    getAllProducts(),
    getShopInfo(),
  ])
  return <ShopClient products={products} shopInfo={shopInfo} />
}
