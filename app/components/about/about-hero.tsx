"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Image from "next/image"

export function AboutHero() {
  const scrollToStory = () => {
    document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                We're building the
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  future{" "}
                </span>
                of commerce
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Our mission is to empower businesses and customers with innovative e-commerce solutions that make online
                shopping seamless, secure, and delightful.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6">
                Join Our Journey
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={scrollToStory}>
                Learn More
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">50K+</div>
                <div className="text-sm text-gray-600">Products Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Team collaboration"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Support</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.9★</div>
                <div className="text-xs text-gray-600">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
