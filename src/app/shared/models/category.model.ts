// 🏷️ Category model interface - Defines the structure of a category entity
export interface Category {
  id: string;
  name: string;
  color: string; // Hex color format (e.g., '#FF5733')
  createdAt: Date;
  updatedAt?: Date;
  taskCount?: number; // Optional: number of active tasks in this category
}

// 📝 Type for creating a new category (without id and timestamps)
export interface CreateCategoryDTO {
  name: string;
  color: string;
}

// ✏️ Type for updating an existing category
export interface UpdateCategoryDTO {
  name?: string;
  color?: string;
}
