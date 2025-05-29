import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"

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

interface ProductCardProps {
  product: SerializedProduct
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-square cursor-pointer">
            <Image
              src={product.image || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-200"
            />
            {product.featured && <Badge className="absolute top-2 left-2">Featured</Badge>}
            {product.stock === 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <p className="text-sm text-gray-500">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
          }}
          className="w-full"
        />
      </CardFooter>
    </Card>
  )
}

export default ProductCard
