import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - E-Commerce App",
  description: "Learn about our mission, values, and the team behind our e-commerce platform.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Our Company</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make online shopping seamless, secure, and delightful for businesses and customers
              alike.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                What started as a simple idea has grown into a platform that connects thousands of customers with their
                favorite products.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-gray-600">
                  Our journey began in 2020 when our founders noticed a gap in the market for truly customer-centric
                  e-commerce platforms. We believed that online shopping should be more than just transactions—it should
                  be experiences that delight and inspire.
                </p>
                <p className="text-gray-600">
                  Today, we're proud to serve thousands of businesses and customers worldwide, but we're just getting
                  started. Every day, we work to push the boundaries of what's possible in e-commerce.
                </p>
              </div>

              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Our team at work"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                These core values guide our decisions and define who we are as a company.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer First</h3>
                <p className="text-gray-600">
                  Every decision we make starts with our customers. Their success is our success.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Security</h3>
                <p className="text-gray-600">
                  We protect our customers' data and privacy with enterprise-grade security.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">We constantly push boundaries to create better solutions for tomorrow.</p>
              </div>
            </div>
          </div>
        </section>

       

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of businesses that trust our platform to power their e-commerce success.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/register" className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100">
                Sign Up Free
              </a>
              <a href="/contact" className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800">
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
