import { render, screen } from "@testing-library/react"
import ProductCard from "@/components/products/product-card"

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src = "", alt = "" }: any) => <img src={src} alt={alt} />,
}))

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}))

jest.mock("@/components/cart/add-to-cart-button", () => ({
  AddToCartButton: () => <button>Add to Cart</button>,
}))

const mockProduct = {
  id: "1",
  name: "Test Product",
  description: "A test product",
  price: 49.99,
  image: "/test-product.jpg",
  category: "Test Category",
  stock: 5,
  featured: true,
}

describe("ProductCard", () => {
  it("renders product name and price", () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("$49.99")).toBeInTheDocument()
    expect(screen.getByText("Test Category")).toBeInTheDocument()
    expect(screen.getByText("5 in stock")).toBeInTheDocument()
    expect(screen.getByText("Add to Cart")).toBeInTheDocument()
  })
})
