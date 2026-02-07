import { getAllProducts } from '@/lib/shopify'
import HeroSection from '@/components/HeroSection'
import FeaturedSection from '@/components/FeaturedSection'
import StorySection from '@/components/StorySection'
import { Product } from '@/lib/types'

export default async function Home() {
  let products: Product[] = []

  try {
    products = await getAllProducts()
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="relative">
      <HeroSection />
      <FeaturedSection products={products} />
      <StorySection />
    </div>
  )
}
