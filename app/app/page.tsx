import { Suspense } from "react"
import { HeroSection } from "@/components/home/hero-section"
import { Navbar } from "@/components/layout/navbar"

export default async function HomePage() {


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <Suspense fallback={<div>Loading products...</div>}>
        </Suspense>
      </section>
    </div>
  )
}
