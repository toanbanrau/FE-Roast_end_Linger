import type React from "react"
import { useState } from "react"

import { Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router-dom"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would handle form submission here
    setFormSubmitted(true)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-serif font-bold tracking-tight mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {formSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <h2 className="text-xl font-medium text-green-800 mb-2">Thank You!</h2>
              <p className="text-green-700 mb-4">
                Your message has been sent successfully. We'll get back to you as soon as possible.
              </p>
              <button
                className="border border-green-300 text-green-700 hover:bg-green-100 px-4 py-2 rounded-md font-medium mt-2"
                onClick={() => setFormSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                  required
                >
                  <option value="" disabled selected>
                    Select a subject
                  </option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Question</option>
                  <option value="wholesale">Wholesale Information</option>
                  <option value="feedback">Product Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md font-medium"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-800 mt-1" />
                <div>
                  <p className="font-medium">Élite Coffee Headquarters</p>
                  <p className="text-stone-600">123 Coffee Lane</p>
                  <p className="text-stone-600">Seattle, WA 98101</p>
                  <p className="text-stone-600">United States</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-800" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-stone-600">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-800" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-stone-600">info@elitecoffee.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Hours of Operation</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Wholesale Inquiries</h2>
            <p className="text-stone-600 mb-4">
              Interested in serving Élite Coffee at your café or restaurant? We offer special pricing and support for
              wholesale partners.
            </p>
            <Link
              to="/wholesale"
              className="block text-center border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium w-full"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-serif font-bold tracking-tight mb-6">Visit Our Flagship Store</h2>
        <div className="aspect-video bg-stone-200 rounded-lg">
          {/* In a real app, you would embed a Google Map here */}
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-stone-600">Map Placeholder</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-serif font-bold tracking-tight mb-6">Our Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Downtown Seattle",
              address: "123 Coffee Lane, Seattle, WA 98101",
              phone: "(555) 123-4567",
              hours: "Mon-Fri: 7AM-7PM, Sat-Sun: 8AM-6PM",
              image: "/placeholder.svg?height=200&width=300",
            },
            {
              name: "Capitol Hill",
              address: "456 Roast Avenue, Seattle, WA 98102",
              phone: "(555) 234-5678",
              hours: "Mon-Fri: 7AM-7PM, Sat-Sun: 8AM-6PM",
              image: "/placeholder.svg?height=200&width=300",
            },
            {
              name: "Bellevue",
              address: "789 Bean Boulevard, Bellevue, WA 98004",
              phone: "(555) 345-6789",
              hours: "Mon-Fri: 7AM-7PM, Sat-Sun: 8AM-6PM",
              image: "/placeholder.svg?height=200&width=300",
            },
          ].map((location, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="relative h-48">
                <img
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">{location.name}</h3>
                <p className="text-stone-600 text-sm mb-1">{location.address}</p>
                <p className="text-stone-600 text-sm mb-1">{location.phone}</p>
                <p className="text-stone-600 text-sm">{location.hours}</p>
                <Link
                  to={`/locations/${location.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-amber-800 hover:text-amber-900 text-sm font-medium mt-3 inline-block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-stone-50 p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-stone-600 mb-8">
            Find quick answers to common questions. If you can't find what you're looking for, please contact us.
          </p>
          <div className="space-y-4 text-left">
            {[
              {
                question: "What are your shipping rates?",
                answer:
                  "We offer free shipping on all orders over $50 within the continental US. For orders under $50, a flat rate of $5.95 applies.",
              },
              {
                question: "How fresh is your coffee?",
                answer:
                  "All our coffee is roasted to order and shipped within 24-48 hours of roasting to ensure maximum freshness.",
              },
              {
                question: "Do you offer international shipping?",
                answer:
                  "Yes, we ship to select international destinations. Shipping rates vary by location. Please contact us for more information.",
              },
              {
                question: "What is your return policy?",
                answer:
                  "We want you to be completely satisfied with your purchase. If you're not happy with your coffee, please contact us within 14 days of delivery.",
              },
            ].map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-stone-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
          <Link
            to="/faq"
            className="inline-flex items-center justify-center rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 mt-8"
          >
            View All FAQs
          </Link>
        </div>
      </div>
    </div>
  )
}
