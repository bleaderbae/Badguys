export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-bgc-gray-light mb-4 rounded"></div>
          <div className="h-6 bg-bgc-gray-light mb-2 w-3/4 rounded"></div>
          <div className="h-4 bg-bgc-gray-light w-1/4 rounded"></div>
        </div>
      ))}
    </div>
  )
}
