import { notFound } from "next/navigation"
import { getProductById } from "@/lib/database/products"
import { ProductDetails } from "@/components/products/product-details"
import { Navbar } from "@/components/layout/navbar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, session] = await Promise.all([getProductById(params.id), getServerSession(authOptions)])

  if (!product) {
    notFound()
  }

  const serializedProduct = {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    stock: product.stock,
    featured: product.featured,
    sku: product.sku,
    tags: product.tags || [],
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetails product={serializedProduct} userRole={session?.user?.role || null} />
      </div>
    </div>
  )
}
