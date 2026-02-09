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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-bgc-gray-light mb-4 rounded"></div>
              <div className="h-6 bg-bgc-gray-light mb-2 w-3/4 rounded"></div>
              <div className="h-4 bg-bgc-gray-light w-1/4 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
