// __tests__/contact-page.test.tsx

import { render, screen } from "@testing-library/react"
import ContactPage from "@/app/contact/page"

// Mock the child components
jest.mock("@/components/layout/navbar", () => ({
  Navbar: () => <nav>Mocked Navbar</nav>,
}))
jest.mock("@/components/layout/footer", () => ({
  Footer: () => <footer>Mocked Footer</footer>,
}))
jest.mock("@/components/contact/contact-form-working", () => ({
  ContactFormWorking: () => <form>Mocked Contact Form</form>,
}))

describe("ContactPage", () => {
  it("renders the contact page with main elements", () => {
    render(<ContactPage />)

    expect(screen.getByRole("heading", { name: /contact us/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /send us a message/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /get in touch/i })).toBeInTheDocument()

    expect(screen.getByText(/support@ecommerce.com/i)).toBeInTheDocument()
    expect(screen.getByText(/\+383 44 123 456/i)).toBeInTheDocument()
    expect(screen.getByText(/10000, Pejton/i)).toBeInTheDocument()

    // Mocked components
    expect(screen.getByText("Mocked Navbar")).toBeInTheDocument()
    expect(screen.getByText("Mocked Footer")).toBeInTheDocument()
    expect(screen.getByText("Mocked Contact Form")).toBeInTheDocument()
  })
})
