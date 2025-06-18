import { render, screen } from "@testing-library/react"
import { AboutHero } from "@/components/about/about-hero"

// Mock <Image /> to avoid Next.js issues in tests
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src = "", alt = "" }) => <img src={src} alt={alt} />,
}))


describe("AboutHero", () => {
  it("renders the main heading", () => {
    render(<AboutHero />)
    expect(screen.getByText(/we're building the/i)).toBeInTheDocument()
  })

  it("shows both main buttons", () => {
    render(<AboutHero />)
    expect(screen.getByRole("button", { name: /join our journey/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /learn more/i })).toBeInTheDocument()
  })

  it("shows key stats like 10K+", () => {
    render(<AboutHero />)
    expect(screen.getByText("10K+")).toBeInTheDocument()
    expect(screen.getByText("50K+")).toBeInTheDocument()
    expect(screen.getByText("99.9%")).toBeInTheDocument()
  })
})
