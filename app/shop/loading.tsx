import ProductGridSkeleton from '@/components/ProductGridSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Hero Skeleton */}
      <section className="bg-gradient-to-br from-bgc-black via-bgc-gray to-bgc-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-pulse">
          <div className="h-16 w-96 mx-auto bg-gray-800 rounded mb-6"></div>
          <div className="h-6 w-2/3 mx-auto bg-gray-800 rounded"></div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductGridSkeleton />
      </section>
    </div>
  )
}
