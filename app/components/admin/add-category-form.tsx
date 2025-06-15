"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddCategoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddCategoryForm({ onSuccess, onCancel }: AddCategoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

  };

  const validateForm = () => {
    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return false;
    }
    if (trimmedName.length < 3 || trimmedName.length > 50) {
      setError("Category name must be between 3 and 50 characters.");
      return false;
    }
    if (trimmedDescription.length > 500) {
      setError("Description must not exceed 500 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
      };

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        onSuccess();
        setFormData({
          name: "",
          description: "",
          isActive: true,
        });
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create category.");
      }
    } catch {
      setError("An error occurred while creating the category.");
    } finally {
      setIsLoading(false);
    }
  };

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
          {isLoading ? "Creating..." : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
