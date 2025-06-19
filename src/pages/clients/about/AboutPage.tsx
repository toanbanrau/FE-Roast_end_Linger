import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center">
        <img
          src="/placeholder.svg?height=1080&width=1920"
          alt="Coffee plantation"
          className="object-cover brightness-50"
        />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-serif font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
              Our Story
            </h1>
            <p className="text-xl text-gray-200 md:text-2xl">
              A journey of passion, quality, and sustainability in every cup.
            </p>
          </div>
        </div>
      </section>

      {/* Our History */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">Our Journey</h2>
              <div className="w-20 h-1 bg-amber-800"></div>
              <p className="text-lg text-stone-600">
                Founded in 1992 by coffee enthusiast Maria Rodriguez, Élite Coffee began as a small roastery in Seattle
                with a simple mission: to source and roast the world's finest coffee beans with integrity and care.
              </p>
              <p className="text-lg text-stone-600">
                What started as a passion project quickly gained recognition for its exceptional quality and commitment
                to ethical sourcing. Over three decades, we've grown from a local favorite to an internationally
                respected coffee brand, but our core values remain unchanged.
              </p>
              <p className="text-lg text-stone-600">
                Today, we continue to travel the world in search of extraordinary coffee, building lasting relationships
                with farmers who share our dedication to quality and sustainability.
              </p>
            </div>
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <img
                src="/placeholder.svg?height=1000&width=800"
                alt="Coffee shop history"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-stone-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">Our Values</h2>
            <div className="w-20 h-1 bg-amber-800 mx-auto my-6"></div>
            <p className="text-lg text-stone-600">
              At Élite Coffee, our values guide everything we do, from how we source our beans to how we serve our
              customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality Without Compromise",
                description:
                  "We meticulously select and roast only the finest beans, ensuring each cup delivers an exceptional experience.",
              },
              {
                title: "Ethical Sourcing",
                description:
                  "We pay premium prices to farmers, invest in their communities, and prioritize environmentally sustainable farming practices.",
              },
              {
                title: "Craftsmanship",
                description:
                  "Our master roasters bring decades of expertise to create perfectly balanced roast profiles that highlight each bean's unique characteristics.",
              },
            ].map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-medium mb-4">{value.title}</h3>
                <p className="text-stone-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">Meet Our Team</h2>
            <div className="w-20 h-1 bg-amber-800 mx-auto my-6"></div>
            <p className="text-lg text-stone-600">
              The passionate individuals behind Élite Coffee who make excellence possible every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Maria Rodriguez",
                title: "Founder & Master Roaster",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "James Chen",
                title: "Head of Coffee Sourcing",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Sophia Williams",
                title: "Chief Tasting Officer",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Michael Johnson",
                title: "Sustainability Director",
                image: "/placeholder.svg?height=400&width=400",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative h-80 mb-6 rounded-xl overflow-hidden">
                  <img src={member.image || "/placeholder.svg"} alt={member.name}  className="object-cover" />
                </div>
                <h3 className="text-xl font-medium">{member.name}</h3>
                <p className="text-stone-600">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <img
                src="/placeholder.svg?height=1000&width=800"
                alt="Sustainable coffee farming"
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">
                Our Commitment to Sustainability
              </h2>
              <div className="w-20 h-1 bg-amber-600"></div>
              <p className="text-lg text-stone-300">
                We believe that exceptional coffee and environmental responsibility go hand in hand. Our commitment to
                sustainability extends throughout our entire supply chain.
              </p>
              <p className="text-lg text-stone-300">
                We partner with farmers who use organic and shade-grown methods, reducing the need for chemical
                fertilizers and preserving natural habitats. Our direct trade relationships ensure farmers receive fair
                compensation for their exceptional crops.
              </p>
              <p className="text-lg text-stone-300">
                From our eco-friendly packaging to our energy-efficient roastery, we're constantly working to reduce our
                environmental footprint while delivering the highest quality coffee.
              </p>
              <Link
                to="/sustainability"
                className="inline-flex items-center justify-center rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-4"
              >
                Learn More About Our Initiatives
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl">Join Our Team</h2>
            <div className="w-20 h-1 bg-amber-800 mx-auto"></div>
            <p className="text-lg text-stone-600">
              We're always looking for passionate individuals who share our love for exceptional coffee and our
              commitment to quality and sustainability.
            </p>
            <Link
              to="/careers"
              className="inline-flex items-center justify-center rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              View Open Positions <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
