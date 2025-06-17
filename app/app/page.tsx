import { Suspense } from "react"
import { ProductsGrid } from "@/components/products/products-grid"
import { HeroSection } from "@/components/home/hero-section"
import { Navbar } from "@/components/layout/navbar"
import { getFeaturedProducts } from "@/lib/database/products"
import { Footer } from "@/components/layout/footer"

export default async function HomePage() {
  const featuredProductsData = await getFeaturedProducts();

  const featuredProducts = featuredProductsData.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    stock: product.stock,
    featured: product.featured,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Products
        </h2>
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductsGrid products={featuredProducts} />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}
