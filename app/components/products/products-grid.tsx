import { ProductCard } from "./product-card"

interface SerializedProduct {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  featured: boolean
}

interface ProductsGridProps {
  products: SerializedProduct[]
}

export function ProductsGrid({ products }: ProductsGridProps) {
  console.log("ProductsGrid rendering with", products.length, "products")

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductsGrid
