import mongoose, { type Document, Schema } from "mongoose"

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  productName: string
  quantity: number
  price: number
}

export interface IOrder extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  items: IOrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod?: string
  paymentStatus?: "pending" | "paid" | "failed" | "refunded"
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
})

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    trackingNumber: String,
    notes: String,
  },
  {
    timestamps: true,
  },
)

// Create indexes
OrderSchema.index({ userId: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ createdAt: -1 })

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
