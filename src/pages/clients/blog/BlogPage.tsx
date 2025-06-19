import { Link } from "react-router-dom"
import { Calendar, Clock } from "lucide-react"

export default function BlogPage() {
  // Mock blog posts data
  const featuredPost = {
    slug: "coffee-brewing-techniques",
    title: "The Art of Coffee Brewing: Techniques for the Perfect Cup",
    excerpt:
      "Discover the secrets to brewing exceptional coffee at home with these expert techniques and tips from our master roasters.",
    image: "/placeholder.svg?height=600&width=1200",
    date: "May 15, 2025",
    readTime: "8 min read",
    category: "Brewing Guides",
  }

  const posts = [
    {
      slug: "single-origin-vs-blends",
      title: "Single Origin vs. Blends: Understanding the Differences",
      excerpt:
        "Explore the unique characteristics of single origin coffees and how they differ from carefully crafted blends.",
      image: "/placeholder.svg?height=400&width=600",
      date: "May 10, 2025",
      readTime: "6 min read",
      category: "Coffee Education",
    },
    {
      slug: "sustainable-coffee-farming",
      title: "The Future of Sustainable Coffee Farming",
      excerpt:
        "Learn how innovative farming practices are helping to ensure the future of coffee in the face of climate change.",
      image: "/placeholder.svg?height=400&width=600",
      date: "May 5, 2025",
      readTime: "7 min read",
      category: "Sustainability",
    },
    {
      slug: "coffee-tasting-guide",
      title: "A Beginner's Guide to Coffee Tasting",
      excerpt:
        "Develop your palate and learn to identify the complex flavors and aromas in your daily cup with our simple guide.",
      image: "/placeholder.svg?height=400&width=600",
      date: "April 28, 2025",
      readTime: "5 min read",
      category: "Coffee Education",
    },
    {
      slug: "cold-brew-recipes",
      title: "5 Refreshing Cold Brew Coffee Recipes for Summer",
      excerpt: "Beat the heat with these delicious cold brew recipes that are perfect for warm weather enjoyment.",
      image: "/placeholder.svg?height=400&width=600",
      date: "April 20, 2025",
      readTime: "4 min read",
      category: "Recipes",
    },
    {
      slug: "coffee-origin-ethiopia",
      title: "Origin Spotlight: Ethiopia, the Birthplace of Coffee",
      excerpt:
        "Take a journey to Ethiopia and discover the rich history and unique flavors of coffee from its ancestral home.",
      image: "/placeholder.svg?height=400&width=600",
      date: "April 15, 2025",
      readTime: "9 min read",
      category: "Origin Stories",
    },
    {
      slug: "coffee-equipment-guide",
      title: "Essential Coffee Equipment for Home Baristas",
      excerpt:
        "Invest in the right tools to elevate your home coffee experience with our comprehensive equipment guide.",
      image: "/placeholder.svg?height=400&width=600",
      date: "April 8, 2025",
      readTime: "7 min read",
      category: "Equipment",
    },
  ]

  const categories = [
    "All Categories",
    "Brewing Guides",
    "Coffee Education",
    "Sustainability",
    "Recipes",
    "Origin Stories",
    "Equipment",
    "Company News",
  ]

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">Coffee Journal</h1>

      {/* Featured Post */}
      <div className="mb-16">
        <Link
          to={`/blog/${featuredPost.slug}`}
          className="group block overflow-hidden rounded-2xl bg-stone-100 shadow-md hover:shadow-xl transition-all"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative h-[300px] lg:h-auto overflow-hidden">
              <img
                src={featuredPost.image || "/placeholder.svg"}
                alt={featuredPost.title}
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                  {featuredPost.category}
                </span>
                <span className="text-xs text-stone-500">Featured</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-stone-600 mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center text-sm text-stone-500 mt-auto">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{featuredPost.date}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={index === 0 ? "/blog" : `/blog/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`block px-3 py-2 rounded-md hover:bg-stone-100 ${
                        index === 0 ? "bg-amber-100 text-amber-800 font-medium" : ""
                      }`}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Subscribe</h3>
              <div className="bg-stone-100 p-4 rounded-lg">
                <p className="text-sm text-stone-600 mb-3">
                  Get the latest coffee insights and stories delivered to your inbox.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                  />
                  <button
                    type="submit"
                    className="w-full bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Coffee",
                  "Brewing",
                  "Espresso",
                  "Sustainability",
                  "Pour Over",
                  "Ethiopia",
                  "Colombia",
                  "Recipes",
                  "Roasting",
                  "Equipment",
                ].map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog/tag/${tag.toLowerCase()}`}
                    className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <Link
                key={index}
                to={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium mb-3 group-hover:text-amber-800 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-stone-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-stone-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.date}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-1">
              <button className="h-10 w-10 flex items-center justify-center border rounded-md bg-amber-800 text-white">
                1
              </button>
              <button className="h-10 w-10 flex items-center justify-center border rounded-md hover:bg-amber-50">
                2
              </button>
              <button className="h-10 w-10 flex items-center justify-center border rounded-md hover:bg-amber-50">
                3
              </button>
              <button className="h-10 w-10 flex items-center justify-center border rounded-md hover:bg-amber-50">
                <span className="sr-only">Next</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
