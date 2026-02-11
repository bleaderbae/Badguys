import { getAllProducts, getProduct } from '@/lib/shopify'
import ProductClient from './ProductClient'

export async function generateStaticParams() {
  try {
    const products = await getAllProducts()
    if (products.length === 0) {
      // Fallback for empty/failed fetch during build
      console.warn('No products found or fetch failed. Generating dummy product page.')
      return [{ handle: 'example-product' }]
    }
    return products.map((product: any) => ({
      handle: product.node.handle,
    }))
  } catch (error) {
    console.warn('Error fetching products. Generating dummy product page.', error)
    return [{ handle: 'example-product' }]
  }
}

interface Props {
  params: Promise<{ handle: string }>
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const product = await getProduct(params.handle)
  return <ProductClient product={product} />
}
