import { ShoppingBag, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <img
          src="https://img.freepik.com/premium-psd/banner-template-coffee-sale-social-media-post_268949-63.jpg?semt=ais_items_boosted&w=740"
          alt="Luxury coffee beans"
          className="object-cover w-full h-full absolute inset-0  brightness-50"
        />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-serif font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
              Experience the Finest Coffee Craftsmanship
            </h1>
            <p className="text-xl text-gray-200 md:text-2xl">
              Indulge in our premium selection of ethically sourced, artisanally
              roasted coffee beans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Shop Collection <ShoppingBag className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-md border border-white bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                Our Story <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-stone-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl md:text-5xl text-stone-900">
              Featured Collections
            </h2>
            <div className="w-20 h-1 bg-amber-800 my-6"></div>
            <p className="text-lg text-stone-600 max-w-2xl">
              Discover our handpicked selection of the world's most exceptional
              coffee beans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Ethiopian Yirgacheffe",
                price: "$24.95",
                image: "/placeholder.svg?height=400&width=400",
                description:
                  "Floral and citrus notes with a silky smooth finish",
              },
              {
                name: "Colombian Supremo",
                price: "$22.95",
                image: "/placeholder.svg?height=400&width=400",
                description:
                  "Rich caramel sweetness with a hint of toasted nuts",
              },
              {
                name: "Sumatra Mandheling",
                price: "$26.95",
                image: "/placeholder.svg?height=400&width=400",
                description: "Earthy, full-bodied with notes of dark chocolate",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://product.hstatic.net/1000075078/product/1737357663_cpg-cfsd-tui_f866066067b44f9b9258c2240a54b9ac_large.png"
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-stone-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-stone-600">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-semibold text-amber-800">
                      {product.price}
                    </span>
                    <button className="text-amber-800 hover:text-amber-900 hover:bg-amber-50 px-3 py-1 rounded-md text-sm font-medium">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="text-amber-800 hover:text-amber-900 text-lg font-medium inline-flex items-center"
            >
              View All Collections <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <img
                src="https://cdn.s99.vn/ss2/prod/product/d30c161f3acc792af11ed594c8942030_1699843641.jpg?at=1701809332"
                alt="Coffee plantation"
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">
                Our Passion for Excellence
              </h2>
              <div className="w-20 h-1 bg-amber-600"></div>
              <p className="text-lg text-stone-300">
                For over three decades, we have traveled the world in search of
                the finest coffee beans, building relationships with farmers who
                share our commitment to quality and sustainability.
              </p>
              <p className="text-lg text-stone-300">
                Each batch is carefully selected, roasted to perfection, and
                delivered at the peak of freshness. Our master roasters bring
                decades of expertise to create a coffee experience like no
                other.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-4"
              >
                Learn More About Our Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-stone-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl md:text-5xl text-stone-900">
              What Our Clients Say
            </h2>
            <div className="w-20 h-1 bg-amber-800 my-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The most exquisite coffee I've ever tasted. Each cup is a journey of flavors.",
                author: "Emily Richardson",
                title: "Coffee Enthusiast",
              },
              {
                quote:
                  "Their attention to detail and commitment to quality is unmatched in the industry.",
                author: "Michael Chen",
                title: "Food Critic",
              },
              {
                quote:
                  "From bean to cup, they've mastered every step of the coffee experience.",
                author: "Sophia Martinez",
                title: "Café Owner",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-amber-800 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                  </svg>
                </div>
                <p className="text-lg text-stone-700 mb-6">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-medium text-stone-900">
                    {testimonial.author}
                  </p>
                  <p className="text-stone-500">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-amber-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">
              Join Our Coffee Club
            </h2>
            <p className="text-lg text-amber-100">
              Subscribe to receive exclusive offers, brewing tips, and early
              access to limited edition releases.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-md text-stone-900 w-full focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              <button className="bg-stone-900 hover:bg-stone-800 text-white whitespace-nowrap px-4 py-3 rounded-md font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
