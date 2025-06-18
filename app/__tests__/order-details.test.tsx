import { render, screen } from "@testing-library/react"
// import { OrderDetailsModal } from "@components/orders/order-details-modal"

import { OrderDetailsModal } from "@/components/admin/order-details-modal"

const fakeOrder = {
  _id: "order123456",
  status: "pending",
  trackingNumber: "123456789",
  userId: { name: "John Doe", email: "john@example.com" },
  createdAt: new Date().toISOString(),
  items: [
    { productName: "Product 1", quantity: 2, price: 10 },
    { productName: "Product 2", quantity: 1, price: 20 },
  ],
  total: 40,
  shippingAddress: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
  },
  paymentMethod: "Credit Card",
  paymentStatus: "paid",
}

describe("OrderDetailsModal", () => {
  it("renders order modal with basic info", () => {
    render(
      <OrderDetailsModal
        order={fakeOrder}
        isOpen={true}
        onClose={() => {}}
        onStatusUpdate={() => Promise.resolve()}
      />
    )

    expect(screen.getByText("Order Details")).toBeInTheDocument()
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Product 1")).toBeInTheDocument()
    expect(screen.getByText("Product 2")).toBeInTheDocument()
    expect(screen.getByText("$40.00")).toBeInTheDocument()
  })
})