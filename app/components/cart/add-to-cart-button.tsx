"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart"
import { ShoppingCart, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    stock: number
  }
  quantity?: number
  disabled?: boolean
  className?: string
}

export function AddToCartButton({ product, quantity = 1, disabled = false, className }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, items } = useCartStore()

  const existingItem = items.find((item) => item.id === product.id)
  const currentQuantityInCart = existingItem?.quantity || 0
  const totalQuantityAfterAdd = currentQuantityInCart + quantity

  const isOutOfStock = product.stock === 0
  const isMaxQuantity = totalQuantityAfterAdd > product.stock

  const handleAddToCart = async () => {
    if (isOutOfStock || isMaxQuantity) return

    setIsAdding(true)

    try {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
        })
      }

      setJustAdded(true)

      toast({
        title: "Added to cart!",
        description: `${quantity > 1 ? `${quantity}x ` : ""}${product.name} ${quantity > 1 ? "have" : "has"} been added to your cart.`,
      })

      setTimeout(() => setJustAdded(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  if (isOutOfStock) {
    return (
      <Button disabled className={className}>
        Out of Stock
      </Button>
    )
  }

  if (isMaxQuantity) {
    return (
      <Button disabled className={className}>
        Max Quantity Reached
      </Button>
    )
  }

  return (
    <Button onClick={handleAddToCart} disabled={disabled || isAdding} className={className}>
      {isAdding ? (
        "Adding..."
      ) : justAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart {quantity > 1 && `(${quantity})`}
        </>
      )}
    </Button>
  )
}
