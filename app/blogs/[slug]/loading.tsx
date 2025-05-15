export default function BlogDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="mb-8">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
        <div className="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-4 mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="h-[300px] md:h-[500px] bg-gray-200 rounded-lg animate-pulse mb-8"></div>

      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
        <div>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>

      <div className="mb-8">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="mb-12">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
