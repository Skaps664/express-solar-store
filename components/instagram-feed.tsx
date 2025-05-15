export default function InstagramFeed() {
  const posts = [
    { id: 1, image: "installation-1", description: "5kW residential installation in Lahore", likes: 245, comments: 18 },
    { id: 2, image: "installation-2", description: "10kW commercial system in Karachi", likes: 189, comments: 24 },
    { id: 3, image: "product-1", description: "New Jinko panels in stock", likes: 327, comments: 32 },
    { id: 4, image: "installation-3", description: "Off-grid system for rural home", likes: 156, comments: 12 },
    { id: 5, image: "team-1", description: "Our installation team at work", likes: 278, comments: 27 },
    { id: 6, image: "product-2", description: "Tesla Powerwall installation", likes: 193, comments: 15 },
  ]

  return (
    <div className="my-16">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-3xl font-bold text-[#1a5ca4]">Follow Us on Instagram</h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          @solarexpresspk • Share your installation with #SolarExpressPK
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300"
          >
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs md:text-sm text-gray-400">
              [Instagram Post: {post.image}]
              <br />
              {post.description}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all group-hover:bg-opacity-50 group-hover:opacity-100">
              <div className="flex gap-3 md:gap-4 text-xs md:text-sm text-white">
                <div className="flex items-center gap-1">
                  <span>❤️</span>
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💬</span>
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
