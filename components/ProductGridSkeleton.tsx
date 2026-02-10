interface ProductGridSkeletonProps {
  count?: number
  className?: string
  itemClassName?: string
  imageAspectRatio?: string
}

export default function ProductGridSkeleton({
  count = 8,
  className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
  itemClassName = "bg-bgc-gray-light rounded",
  imageAspectRatio = "aspect-square"
}: ProductGridSkeletonProps) {
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className={`${imageAspectRatio} mb-4 ${itemClassName}`}></div>
          <div className={`h-6 mb-2 w-3/4 ${itemClassName}`}></div>
          <div className={`h-4 w-1/4 ${itemClassName}`}></div>
        </div>
      ))}
    </div>
  )
}
