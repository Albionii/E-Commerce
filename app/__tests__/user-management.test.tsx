import { render, screen, waitFor } from "@testing-library/react"
import { UserManagement } from "../components/admin/user-management"

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ users: [], pages: 1 }),
    ok: true,
  })
) as jest.Mock

test("renders loading state", async() => {
  render(<UserManagement />)

  await waitFor(() => {
    // Adjust this to what your component shows after loading users
    expect(screen.getByText(/no users found/i)).toBeInTheDocument()
  })
})
