import mongoose from "mongoose"
import connectDB from "@/lib/mongodb"
import Category from "@/lib/models/Category"
import Product from "@/lib/models/Product"

export async function getAllCategories({
  page = 1,
  limit = 20,
  search,
  includeProductCount = false,
}: {
  page?: number
  limit?: number
  search?: string
  includeProductCount?: boolean
} = {}) {
  try {
    await connectDB()

    const query: any = {}

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const skip = (page - 1) * limit

    const [categories, total] = await Promise.all([
      Category.find(query).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      Category.countDocuments(query),
    ])

    let categoriesWithCount = categories
    if (includeProductCount) {
      categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const productCount = await Product.countDocuments({ category: category.name })
          return { ...category, productCount }
        }),
      )
    }


    return {
      categories: categoriesWithCount,
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export async function getCategoryById(id: string) {
  try {
    await connectDB()
    const category = await Category.findById(id).lean()

    if (!category) {
      throw new Error("Category not found")
    }

    const productCount = await Product.countDocuments({ category: category.name })

    return { ...category, productCount }
  } catch (error) {
    console.error("Error fetching category:", error)
    throw error
  }
}

export async function createCategory(categoryData: {
  name: string
  description?: string
  isActive?: boolean
}) {
  try {
    await connectDB()

    const slug = categoryData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const existing = await Category.findOne({
      $or: [{ name: { $regex: new RegExp(`^${categoryData.name}$`, "i") } }, { slug: slug }],
    })

    if (existing) {
      throw new Error("Category with this name already exists")
    }

    const category = new Category({
      ...categoryData,
      slug: slug,
    })

    await category.save()

    return category.toObject()
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
}

export async function updateCategory(
  id: string,
  categoryData: {
    name?: string
    description?: string
    isActive?: boolean
  },
) {
  try {
    await connectDB()

    if (categoryData.name) {
      const existing = await Category.findOne({
        _id: { $ne: id },
        $or: [
          { name: { $regex: new RegExp(`^${categoryData.name}$`, "i") } },
          {
            slug: categoryData.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
          },
        ],
      })

      if (existing) {
        throw new Error("Category with this name already exists")
      }
    }

    const category = await Category.findByIdAndUpdate(id, categoryData, { new: true, runValidators: true })

    if (!category) {
      throw new Error("Category not found")
    }

    if (categoryData.name) {
      const oldCategory = await Category.findById(id)
      if (oldCategory && oldCategory.name !== categoryData.name) {
        await Product.updateMany({ category: oldCategory.name }, { category: categoryData.name })
      }
    }

    return category.toObject()
  } catch (error) {
    console.error("Error updating category:", error)
    throw error
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category ID format")
    }

    const category = await Category.findById(id)
    if (!category) {
      throw new Error("Category not found")
    }

    const productCount = await Product.countDocuments({ category: category.name })
    if (productCount > 0) {
      throw new Error(`Cannot delete category. It is being used by ${productCount} product(s).`)
    }

    await Category.findByIdAndDelete(id)

    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    throw error
  }
}
