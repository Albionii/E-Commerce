"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { IProduct } from "@/lib/models/Product";

interface EditProductFormProps {
  product: IProduct;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditProductForm({
  product,
  onSuccess,
  onCancel,
}: EditProductFormProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    stock: product.stock.toString(),
    image: product.image,
    featured: product.featured,
    sku: product.sku || "",
    tags: product.tags?.join(", ") || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // const categories = ["Electronics", "Clothing", "Home", "Sports", "Books", "Beauty", "Toys", "Automotive"]

  const [categories, setCategories] = useState<string[]>([]);
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "/api/categories?limit=100&includeProductCount=false"
      );
      const data = await response.json();

      const names = data.categories
        .filter((cat: any) => cat.isActive && typeof cat.name === "string")
        .map((cat: any) => cat.name);

      setCategories(names);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Updating product with ID:", product._id);

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        stock: Number.parseInt(formData.stock),
        image: formData.image,
        featured: formData.featured,
        sku: formData.sku || undefined,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      };

      console.log("Sending product data:", productData);

      const response = await fetch(`/api/products/${product._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const updatedProduct = await response.json();
        console.log("Product updated successfully:", updatedProduct);
        onSuccess();
      } else {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        setError(
          errorData.error || `Failed to update product (${response.status})`
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError(
        "An error occurred while updating the product. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleInputChange("sku", e.target.value)}
            placeholder="Enter SKU (optional)"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter product description"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => handleInputChange("stock", e.target.value)}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL *</Label>
        <Input
          id="image"
          type="url"
          value={formData.image}
          onChange={(e) => handleInputChange("image", e.target.value)}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => handleInputChange("tags", e.target.value)}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => handleInputChange("featured", checked)}
        />
        <Label htmlFor="featured">Featured Product</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Product"}
        </Button>
      </div>
    </form>
  );
}

export default EditProductForm;
