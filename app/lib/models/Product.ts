import mongoose, { type Document, Schema } from "mongoose"

export interface IProduct extends Document {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  featured: boolean
  sku?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
  },
)

ProductSchema.index({ name: "text", description: "text" })
ProductSchema.index({ category: 1 })
ProductSchema.index({ featured: 1 })
ProductSchema.index({ price: 1 })

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
