import { Link } from "react-router-dom"
import { Calendar, Clock, Facebook, Linkedin, Tag, Twitter } from "lucide-react"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch this data based on the slug
  const post = {
    slug: params.slug,
    title: "The Art of Coffee Brewing: Techniques for the Perfect Cup",
    content: `
      <p>Coffee brewing is both an art and a science. The perfect cup requires attention to detail, quality ingredients, and the right technique. In this comprehensive guide, we'll explore various brewing methods and share expert tips to help you elevate your coffee experience at home.</p>
      
      <h2>Understanding Coffee Basics</h2>
      
      <p>Before diving into specific brewing methods, it's important to understand the key factors that influence coffee flavor:</p>
      
      <ul>
        <li><strong>Coffee Beans:</strong> Always start with fresh, high-quality beans. The origin, processing method, and roast level all impact flavor.</li>
        <li><strong>Grind Size:</strong> Different brewing methods require different grind sizes. Too fine or too coarse can lead to under or over-extraction.</li>
        <li><strong>Water Quality:</strong> Coffee is 98% water, so use filtered water free from strong odors or flavors.</li>
        <li><strong>Water Temperature:</strong> The ideal brewing temperature is between 195°F and 205°F (90°C to 96°C).</li>
        <li><strong>Brewing Time:</strong> Each method has an optimal brewing time to extract the best flavors without bitterness.</li>
      </ul>
      
      <h2>Pour-Over Method</h2>
      
      <p>The pour-over method offers exceptional clarity and highlights the nuanced flavors of single-origin coffees.</p>
      
      <h3>What You'll Need:</h3>
      
      <ul>
        <li>Pour-over dripper (Hario V60, Chemex, or Kalita Wave)</li>
        <li>Appropriate filters</li>
        <li>Freshly roasted coffee beans</li>
        <li>Burr grinder</li>
        <li>Gooseneck kettle</li>
        <li>Scale</li>
        <li>Timer</li>
      </ul>
      
      <h3>Step-by-Step Process:</h3>
      
      <ol>
        <li>Bring water to a boil, then let it cool for 30 seconds (to approximately 200°F/93°C).</li>
        <li>Grind coffee to medium-fine consistency (similar to sand).</li>
        <li>Place filter in dripper and rinse with hot water to remove paper taste and preheat equipment.</li>
        <li>Add ground coffee to the filter and create a small divot in the center.</li>
        <li>Start timer and pour just enough water (about twice the weight of the coffee) to saturate the grounds. This is called the "bloom" phase.</li>
        <li>After 30-45 seconds, slowly pour water in a spiral motion, maintaining a consistent flow rate.</li>
        <li>Aim for a total brew time of 2:30-3:30 minutes for a V60, or 4-5 minutes for a Chemex.</li>
      </ol>
      
      <h2>French Press Method</h2>
      
      <p>The French Press produces a full-bodied cup with rich mouthfeel, perfect for highlighting the depth and richness of darker roasts.</p>
      
      <h3>What You'll Need:</h3>
      
      <ul>
        <li>French Press</li>
        <li>Freshly roasted coffee beans</li>
        <li>Burr grinder</li>
        <li>Kettle</li>
        <li>Timer</li>
      </ul>
      
      <h3>Step-by-Step Process:</h3>
      
      <ol>
        <li>Heat water to 200°F/93°C.</li>
        <li>Grind coffee to a coarse consistency (similar to sea salt).</li>
        <li>Add coffee to the French Press.</li>
        <li>Pour hot water over the grounds, saturating them completely.</li>
        <li>Stir gently to ensure all grounds are wet.</li>
        <li>Place the plunger on top but don't press down. Let brew for 4 minutes.</li>
        <li>Slowly press the plunger down.</li>
        <li>Pour immediately to prevent over-extraction.</li>
      </ol>
      
      <h2>Espresso Method</h2>
      
      <p>Espresso is the foundation for many coffee drinks and requires precision and practice to master.</p>
      
      <h3>What You'll Need:</h3>
      
      <ul>
        <li>Espresso machine</li>
        <li>Freshly roasted espresso beans</li>
        <li>Burr grinder capable of fine espresso grind</li>
        <li>Tamper</li>
        <li>Scale (optional but recommended)</li>
        <li>Timer</li>
      </ul>
      
      <h3>Step-by-Step Process:</h3>
      
      <ol>
        <li>Turn on your espresso machine and allow it to heat up completely.</li>
        <li>Grind coffee to a fine consistency.</li>
        <li>Dose 18-20g of coffee into the portafilter.</li>
        <li>Distribute the grounds evenly and tamp with firm, even pressure.</li>
        <li>Lock the portafilter into the group head and start extraction immediately.</li>
        <li>Aim for a 25-30 second extraction time for a 1:2 ratio (e.g., 18g coffee to 36g espresso).</li>
        <li>The perfect shot should have a golden-brown crema and a balanced flavor.</li>
      </ol>
      
      <h2>Common Brewing Mistakes to Avoid</h2>
      
      <ul>
        <li><strong>Using old coffee:</strong> Coffee is at its best 1-2 weeks after roasting.</li>
        <li><strong>Inconsistent grind size:</strong> Invest in a quality burr grinder for uniform particle size.</li>
        <li><strong>Incorrect water temperature:</strong> Too hot can cause bitterness, too cool can lead to under-extraction.</li>
        <li><strong>Improper coffee-to-water ratio:</strong> A general guideline is 1:16 (coffee to water) for most brewing methods.</li>
        <li><strong>Neglecting equipment cleaning:</strong> Coffee oils can build up and impart rancid flavors.</li>
      </ul>
      
      <h2>Conclusion</h2>
      
      <p>Brewing exceptional coffee at home is a rewarding journey that combines science, art, and a bit of patience. By understanding the principles behind different brewing methods and practicing your technique, you'll be able to create café-quality coffee tailored to your personal taste preferences.</p>
      
      <p>Remember that experimentation is part of the process. Don't be afraid to adjust variables like grind size, coffee-to-water ratio, or brewing time to find your perfect cup. With practice and attention to detail, you'll be brewing coffee that rivals your favorite café in no time.</p>
    `,
    image: "/placeholder.svg?height=600&width=1200",
    date: "May 15, 2025",
    readTime: "8 min read",
    category: "Brewing Guides",
    author: {
      name: "James Wilson",
      title: "Head Barista",
      image: "/placeholder.svg?height=100&width=100",
    },
    relatedPosts: [
      {
        slug: "single-origin-vs-blends",
        title: "Single Origin vs. Blends: Understanding the Differences",
        image: "/placeholder.svg?height=200&width=300",
        category: "Coffee Education",
      },
      {
        slug: "coffee-equipment-guide",
        title: "Essential Coffee Equipment for Home Baristas",
        image: "/placeholder.svg?height=200&width=300",
        category: "Equipment",
      },
      {
        slug: "coffee-tasting-guide",
        title: "A Beginner's Guide to Coffee Tasting",
        image: "/placeholder.svg?height=200&width=300",
        category: "Coffee Education",
      },
    ],
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-amber-800">
          Home
        </Link>
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
          className="h-4 w-4 mx-2"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <Link to="/blog" className="hover:text-amber-800">
          Blog
        </Link>
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
          className="h-4 w-4 mx-2"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <span className="text-stone-900">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Featured Image */}
          <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="object-cover" />
          </div>

          {/* Post Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link
                to={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full"
              >
                {post.category}
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4">{post.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{post.author.name}</p>
                  <p className="text-xs text-stone-500">{post.author.title}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-stone-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{post.date}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Tags */}
          <div className="flex items-center gap-2 mb-8 border-t border-b py-4">
            <Tag className="h-4 w-4 text-stone-500" />
            <div className="flex flex-wrap gap-2">
              {["Coffee", "Brewing", "Pour Over", "French Press", "Espresso"].map((tag, index) => (
                <Link
                  key={index}
                  to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1 rounded-full"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="flex items-center gap-4 mb-12">
            <span className="text-sm font-medium">Share this post:</span>
            <div className="flex gap-2">
              <button className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700">
                <Linkedin className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Author Bio */}
          <div className="bg-stone-50 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={post.author.image || "/placeholder.svg"}
                  alt={post.author.name}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">About {post.author.name}</h3>
                <p className="text-stone-600 text-sm mb-3">
                  James is our Head Barista with over 10 years of experience in specialty coffee. He's a certified Q
                  Grader and has competed in national barista championships. When not brewing coffee, he enjoys hiking
                  and photography.
                </p>
                <Link to="/about/team" className="text-amber-800 hover:text-amber-900 text-sm font-medium">
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-xl font-medium mb-6">Comments (3)</h3>
            <div className="space-y-6">
              {[
                {
                  name: "Sarah Johnson",
                  date: "May 16, 2025",
                  content:
                    "This is such a helpful guide! I've been struggling with my pour-over technique, and your tips about water temperature and grind size made a huge difference. Thank you!",
                  image: "/placeholder.svg?height=50&width=50",
                },
                {
                  name: "Michael Chen",
                  date: "May 16, 2025",
                  content:
                    "Great article! I'd love to see more about how different water mineral content affects extraction. Have you found significant differences between various filtered water options?",
                  image: "/placeholder.svg?height=50&width=50",
                },
                {
                  name: "Emma Williams",
                  date: "May 17, 2025",
                  content:
                    "I just got a new espresso machine and this guide is exactly what I needed. The step-by-step instructions are so clear. Looking forward to more brewing guides!",
                  image: "/placeholder.svg?height=50&width=50",
                },
              ].map((comment, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={comment.image || "/placeholder.svg"}
                        alt={comment.name}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{comment.name}</h4>
                        <span className="text-xs text-stone-500">{comment.date}</span>
                      </div>
                      <p className="text-stone-600 text-sm">{comment.content}</p>
                      <button className="text-amber-800 hover:text-amber-900 text-sm font-medium mt-2">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">Leave a Comment</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium mb-1">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* Related Posts */}
            <div>
              <h3 className="text-lg font-medium mb-4">Related Posts</h3>
              <div className="space-y-4">
                {post.relatedPosts.map((relatedPost, index) => (
                  <Link key={index} to={`/blog/${relatedPost.slug}`} className="flex items-start gap-3 group">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-amber-800">{relatedPost.category}</span>
                      <h4 className="text-sm font-medium group-hover:text-amber-800 transition-colors">
                        {relatedPost.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              <ul className="space-y-2">
                {[
                  "All Categories",
                  "Brewing Guides",
                  "Coffee Education",
                  "Sustainability",
                  "Recipes",
                  "Origin Stories",
                  "Equipment",
                ].map((category, index) => (
                  <li key={index}>
                    <Link
                      to={index === 0 ? "/blog" : `/blog/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`block px-3 py-2 rounded-md hover:bg-stone-100 ${
                        category === post.category ? "bg-amber-100 text-amber-800 font-medium" : ""
                      }`}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            <div>
              <h3 className="text-lg font-medium mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Coffee",
                  "Brewing",
                  "Espresso",
                  "Pour Over",
                  "French Press",
                  "Ethiopia",
                  "Colombia",
                  "Recipes",
                  "Roasting",
                  "Equipment",
                ].map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-stone-100 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-stone-600 mb-4">
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
        </div>
      </div>
    </div>
  )
}
