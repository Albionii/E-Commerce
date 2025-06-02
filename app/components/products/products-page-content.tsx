import { ProductsGrid } from "./products-grid"
import { ProductsFilters } from "./products-filters"
import { ProductsSort } from "./products-sort"
import { ProductsPagination } from "./products-pagination"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProductsPageContentProps {
  searchParams: {
    category?: string
    search?: string
    page?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }
}

export async function ProductsPageContent({ searchParams }: ProductsPageContentProps) {
  try {


    const page = Number(searchParams.page) || 1
    const limit = 12
    const category = searchParams.category
    const search = searchParams.search
    const sort = searchParams.sort || "newest"
    const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
    const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined

    const filters = {
      page,
      limit,
      category,
      search,
      minPrice,
      maxPrice,
      sort,
    }


    const { getAllProducts, getCategories } = await import("@/lib/database/products")

    const [productsResult, categories] = await Promise.all([
      getAllProducts(filters).catch((error) => {
        console.error("Error fetching products:", error)
        return { products: [], total: 0, pages: 0 }
      }),
      getCategories().catch((error) => {
        console.error("Error fetching categories:", error)
        return []
      }),
    ])

    const { products, total, pages } = productsResult


    const serializedProducts = products.map((product: any) => ({
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
      featured: product.featured,
    }))

    const activeFiltersCount = [category, search, minPrice, maxPrice].filter(Boolean).length

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount} active</Badge>}
            </div>
            <ProductsFilters
              categories={categories}
              currentCategory={category}
              currentSearch={search}
              currentMinPrice={minPrice}
              currentMaxPrice={maxPrice}
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <p className="text-gray-600">
                Showing {serializedProducts.length} of {total} products
                {category && (
                  <span className="ml-1">
                    in <span className="font-medium">{category}</span>
                  </span>
                )}
                {search && (
                  <span className="ml-1">
                    for <span className="font-medium">"{search}"</span>
                  </span>
                )}
              </p>
            </div>
            <ProductsSort currentSort={sort} />
          </div>

          {serializedProducts.length > 0 ? (
            <>
              <ProductsGrid products={serializedProducts} />

              {pages > 1 && (
                <div className="mt-8">
                  <ProductsPagination currentPage={page} totalPages={pages} searchParams={searchParams} />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in ProductsPageContent:", error)

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="text-sm text-gray-500">Filters unavailable</div>
        </div>
        <div className="lg:col-span-3">
          <Alert variant="destructive">
            <AlertDescription>
              Unable to load products from database. Please check your database connection.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }
}
