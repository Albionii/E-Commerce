import { GET } from "@/app/api/admin/stats/route"

const mockJson = jest.fn()

jest.mock("next/server", () => ({
  NextResponse: {
    json: mockJson,
  },
}))

jest.mock("@/lib/dal", () => ({
  verifySession: jest.fn(() => Promise.resolve({ userId: "123", role: "admin" })),
}))

jest.mock("@/lib/database/orders", () => ({
  getTotalRevenue: jest.fn(() => Promise.resolve({ totalUsers: 42 })),
}))

describe("GET /api/admin/stats", () => {
  beforeEach(() => {
    mockJson.mockClear()
  })

  it("returns stats for admin user", async () => {
    await GET()
    expect(mockJson).toHaveBeenCalledWith({ totalUsers: 42 })
  })

  it("returns 403 for unauthorized users", async () => {
    const { verifySession } = require("@/lib/dal")
    verifySession.mockImplementationOnce(() =>
      Promise.resolve({ userId: "456", role: "user" }),
    )

    await GET()

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Unauthorized" }),
    )
  })
})
