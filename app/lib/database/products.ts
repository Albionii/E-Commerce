import connectDB from "@/lib/mongodb"
import Product, { type IProduct } from "@/lib/models/Product"
import mongoose from "mongoose"

export async function createProduct(productData: Partial<IProduct>) {
  try {
    console.log("Creating product...")
    await connectDB()
    const product = new Product(productData)
    await product.save()
    console.log("Product created successfully:", product._id)
    return product
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function getProductById(id: string): Promise<IProduct | null> {
  try {
    console.log("Fetching product by ID:", id)
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id)
      return null
    }

    const product = await Product.findById(id).lean()
    console.log("Product fetched:", !!product)
    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    throw error
  }
}

export async function getAllProducts(
  filters: {
    page?: number
    limit?: number
    category?: string
    featured?: boolean
    search?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
  } = {},
) {
  try {
    console.log("Fetching all products with filters:", filters)
    await connectDB()

    const { page = 1, limit = 12, category, featured, search, minPrice, maxPrice, sort = "newest" } = filters

    const skip = (page - 1) * limit

    const query: any = {}

    if (category) {
      query.category = category
    }

    if (featured !== undefined) {
      query.featured = featured
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ]
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}
      if (minPrice !== undefined) query.price.$gte = minPrice
      if (maxPrice !== undefined) query.price.$lte = maxPrice
    }

    console.log("Database query:", query)

    let sortQuery: any = {}
    switch (sort) {
      case "newest":
        sortQuery = { createdAt: -1 }
        break
      case "oldest":
        sortQuery = { createdAt: 1 }
        break
      case "price-low":
        sortQuery = { price: 1 }
        break
      case "price-high":
        sortQuery = { price: -1 }
        break
      case "name-asc":
        sortQuery = { name: 1 }
        break
      case "name-desc":
        sortQuery = { name: -1 }
        break
      case "featured":
        sortQuery = { featured: -1, createdAt: -1 }
        break
      default:
        sortQuery = { createdAt: -1 }
    }

    console.log("Sort query:", sortQuery)

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort(sortQuery).lean(),
      Product.countDocuments(query),
    ])

    console.log("Products query result:", {
      productsCount: products.length,
      total,
      pages: Math.ceil(total / limit),
    })

    return {
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

export async function updateProduct(id: string, updateData: Partial<IProduct>) {
  try {
    console.log("Updating product:", id, "with data:", updateData)
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id)
      return null
    }

    const cleanUpdateData = { ...updateData }

    Object.keys(cleanUpdateData).forEach((key) => {
      if (cleanUpdateData[key] === undefined) {
        delete cleanUpdateData[key]
      }
    })

    console.log("Clean update data:", cleanUpdateData)

    const product = await Product.findByIdAndUpdate(id, cleanUpdateData, {
      new: true, 
      runValidators: true, 
    })

    console.log("Product updated successfully:", !!product)
    return product
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  try {
    console.log("Deleting product:", id)
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id)
      return null
    }

    const product = await Product.findByIdAndDelete(id)
    console.log("Product deleted successfully:", !!product)
    return product
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

export async function getFeaturedProducts() {
  try {
    console.log("Fetching featured products...")
    await connectDB()
    const products = await Product.find({ featured: true }).limit(8).lean()
    console.log("Featured products fetched:", products.length)
    return products
  } catch (error) {
    console.error("Error fetching featured products:", error)
    throw error
  }
}

export async function getProductsByCategory(category: string) {
  try {
    console.log("Fetching products by category:", category)
    await connectDB()
    const products = await Product.find({ category }).lean()
    console.log("Products by category fetched:", products.length)
    return products
  } catch (error) {
    console.error("Error fetching products by category:", error)
    throw error
  }
}

export async function updateProductStock(id: string, quantity: number) {
  try {
    console.log("Updating product stock:", { id, quantity })
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id)
      return null
    }

    const product = await Product.findByIdAndUpdate(id, { $inc: { stock: -quantity } }, { new: true })
    console.log("Product stock updated successfully:", !!product)
    return product
  } catch (error) {
    console.error("Error updating product stock:", error)
    throw error
  }
}

export async function getCategories() {
  try {
    console.log("Fetching categories...")
    await connectDB()
    const categories = await Product.distinct("category")
    console.log("Categories fetched:", categories.length)
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return [] 
  }
}
