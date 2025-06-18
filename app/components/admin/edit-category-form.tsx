"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ICategory } from "@/lib/models/Category"

interface EditCategoryFormProps {
  category: ICategory
  onSuccess: () => void
  onCancel: () => void
}

export function EditCategoryForm({ category, onSuccess, onCancel }: EditCategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description || "",
    isActive: category.isActive,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {

      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
      }


      const response = await fetch(`/api/categories/${category._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })


      if (response.ok) {
        const updatedCategory = await response.json()
        onSuccess()
      } else {
        const errorData = await response.json()
        console.error("Update failed:", errorData)
        setError(errorData.error || `Failed to update category (${response.status})`)
      }
    } catch (error) {
      console.error("Error updating category:", error)
      setError("An error occurred while updating the category. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter category name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter category description (optional)"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => handleInputChange("isActive", checked)}
        />
        <Label htmlFor="isActive">Active Category</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Category"}
        </Button>
      </div>
    </form>
  )
}