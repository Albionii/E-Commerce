"use client"

<<<<<<< Updated upstream
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
=======
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
>>>>>>> Stashed changes

interface AddProductFormProps {
  onSuccess: () => void
}

export function AddProductForm({ onSuccess }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    featured: false,
    sku: "",
    tags: "",
<<<<<<< Updated upstream
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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


    

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Product name is required.");
      return false;
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      return false;
    }

    if (!formData.price.trim()) {
      setError("Price is required");
      return false;
    }

    const parsedPrice = parseFloat(formData.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Price must be a valid non-negative number.");
      return false;
    }

    if (!formData.stock.trim()) {
      setError("Stock quantity is required");
      return false;
    }

    const parsedStock = parseInt(formData.stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setError("Stock must be a valid non-negative integer.");
      return false;
    }

    if (!formData.category.trim()) {
      setError("Category is required");
      return false;
    }

    if (!formData.image.trim()) {
      setError("Image URL is required");
      return false;
    }

    try {
      new URL(formData.image);
    } catch {
      setError("Image must be a valid URL.");
      return false;
    }

    if (formData.sku && !/^\d+$/.test(formData.sku)) {
      setError("SKU must contain digits only.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
=======
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const categories = ["Electronics", "Clothing", "Home", "Sports", "Books", "Beauty", "Toys", "Automotive"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
>>>>>>> Stashed changes

    try {
      const productData = {
        ...formData,
<<<<<<< Updated upstream
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };
=======
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
      }
>>>>>>> Stashed changes

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
<<<<<<< Updated upstream
        onSuccess();
=======
        onSuccess()
        // Reset form
>>>>>>> Stashed changes
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          image: "",
          featured: false,
          sku: "",
          tags: "",
        })
      } else {
<<<<<<< Updated upstream
        const data = await response.json();
        setError(data.error || "Failed to create product.");
      }
    } catch (err) {
      console.error("Create product error:", err);
      setError("An error occurred while creating the product. Please try again.");
=======
        const data = await response.json()
        setError(data.error || "Failed to create product")
      }
    } catch (error) {
      setError("An error occurred while creating the product")
>>>>>>> Stashed changes
    } finally {
      setIsLoading(false)
    }
  }

<<<<<<< Updated upstream
=======
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

>>>>>>> Stashed changes
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
            
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleInputChange("sku", e.target.value)}
            placeholder="Only numbers"
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
            
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
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
        <Button type="button" variant="outline" onClick={() => onSuccess()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
