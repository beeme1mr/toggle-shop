type ProductGridSkeletonProps = {
  gridCols?: number;
};

export default function ProductGridSkeleton({
  gridCols = 4,
}: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(gridCols)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="w-full h-48 bg-gray-300 animate-pulse" />
          <div className="p-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
