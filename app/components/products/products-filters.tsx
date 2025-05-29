"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

interface ProductsFiltersProps {
  categories: string[]
  currentCategory?: string
  currentSearch?: string
  currentMinPrice?: number
  currentMaxPrice?: number
}

export function ProductsFilters({
  categories,
  currentCategory,
  currentSearch,
  currentMinPrice,
  currentMaxPrice,
}: ProductsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(currentSearch || "")
  const [minPrice, setMinPrice] = useState(currentMinPrice?.toString() || "")
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice?.toString() || "")

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    params.delete("page")

    router.push(`/products?${params.toString()}`)
  }

  const handleCategoryClick = (category: string) => {
    updateFilters({
      category: currentCategory === category ? undefined : category,
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchTerm || undefined })
  }

  const handlePriceFilter = () => {
    updateFilters({
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    })
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setMinPrice("")
    setMaxPrice("")
    router.push("/products")
  }

  const hasActiveFilters = currentCategory || currentSearch || currentMinPrice || currentMaxPrice

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" size="sm" className="w-full">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant={!currentCategory ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilters({ category: undefined })}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={currentCategory === category ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="minPrice" className="text-xs">
                  Min
                </Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="$0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="maxPrice" className="text-xs">
                  Max
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="$999"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
            </div>
            <Button onClick={handlePriceFilter} size="sm" className="w-full">
              Apply Price Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentCategory && (
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Category: {currentCategory}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => updateFilters({ category: undefined })}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {currentSearch && (
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Search: {currentSearch}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => updateFilters({ search: undefined })}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {(currentMinPrice || currentMaxPrice) && (
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    Price: ${currentMinPrice || 0} - ${currentMaxPrice || "∞"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full">
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
