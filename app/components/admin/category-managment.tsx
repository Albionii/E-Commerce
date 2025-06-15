"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AddCategoryForm } from "./add-category-form"
import { EditCategoryForm } from "./edit-category-form"
import type { ICategory } from "@/lib/models/Category"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function CategoryManagement() {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<ICategory | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        includeProductCount: "true",
      })

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      const response = await fetch(`/api/categories?${params}`)
      const data = await response.json()
      setCategories(data.categories)
      setTotalPages(data.pages)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to fetch categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [page, searchTerm])

  const handleCategoryAdded = () => {
    setIsAddDialogOpen(false)
    setPage(1) 
    fetchCategories()
    toast({
      title: "Success",
      description: "Category added successfully!",
    })
  }

  const handleCategoryUpdated = () => {
    setEditingCategory(null)
    fetchCategories()
    toast({
      title: "Success",
      description: "Category updated successfully!",
    })
  }

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/categories/${deletingCategory._id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        fetchCategories()
        toast({
          title: "Success",
          description: "Category deleted successfully!",
        })
      } else {
        console.error("Delete failed:", data)
        toast({
          title: "Error",
          description: data.error || `Failed to delete category (${response.status})`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the category",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeletingCategory(null)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchCategories()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Loading categories...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Category Management</CardTitle>
            <CardDescription>Manage your product categories</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new category for your products</DialogDescription>
              </DialogHeader>
              <AddCategoryForm onSuccess={handleCategoryAdded} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="outline">
              Search
            </Button>
            {searchTerm && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setPage(1)
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        {categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? "No categories found matching your search."
                : "No categories found. Add your first category!"}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description || "No description"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.productCount || 0} products</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingCategory(category)}
                          className="text-red-600 hover:text-red-700"
                          disabled={category.productCount > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-4">
                <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>

      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <EditCategoryForm
              category={editingCategory}
              onSuccess={handleCategoryUpdated}
              onCancel={() => setEditingCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCategory?.name}"? This action cannot be undone.
              {deletingCategory?.productCount > 0 && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <strong>Warning:</strong> This category is being used by {deletingCategory.productCount} product(s).
                  You cannot delete it until all products are moved to other categories.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={isDeleting || (deletingCategory?.productCount || 0) > 0}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
