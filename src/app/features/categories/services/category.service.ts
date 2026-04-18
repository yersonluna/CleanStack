import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '@app/shared/models';
import { StorageService } from '../services/storage.service';

/**
 * 🏷️ Category Service - Business logic for category management
 * Handles CRUD operations, validations, and state management
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly STORAGE_KEY = 'categories';

  // 🔄 BehaviorSubject to share category state across the app
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> =
    this.categoriesSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadCategories();
  }

  /**
   * 📂 Load all categories from storage
   * Called on service initialization and after CRUD operations
   */
  private loadCategories(): void {
    const stored = this.storageService.getItem<Category[]>(this.STORAGE_KEY);
    this.categoriesSubject.next(stored || []);
  }

  /**
   * ➕ Create a new category
   * @param dto - Create category data
   * @returns The created category or null if validation fails
   */
  create(dto: CreateCategoryDTO): Category | null {
    // Validation: Check if name is empty
    if (!dto.name || dto.name.trim().length === 0) {
      console.error('❌ Category name cannot be empty');
      return null;
    }

    // Validation: Check if name already exists
    const exists = this.categoriesSubject.value.some(
      (c) => c.name.toLowerCase() === dto.name.toLowerCase()
    );
    if (exists) {
      console.error('❌ Category name already exists');
      return null;
    }

    // Create new category
    const newCategory: Category = {
      id: this.generateId(),
      name: dto.name.trim(),
      color: this.validateColor(dto.color) ? dto.color : '#808080',
      createdAt: new Date(),
      taskCount: 0,
    };

    // Update state and persist
    const updated = [...this.categoriesSubject.value, newCategory];
    this.storageService.setItem(this.STORAGE_KEY, updated);
    this.categoriesSubject.next(updated);

    console.log(`✅ Category created: ${newCategory.name}`);
    return newCategory;
  }

  /**
   * 👁️ Get a category by ID
   * @param id - Category ID
   * @returns The category or null if not found
   */
  getById(id: string): Category | null {
    return this.categoriesSubject.value.find((c) => c.id === id) || null;
  }

  /**
   * 🔍 Get all categories
   * @returns Array of all categories
   */
  getAll(): Category[] {
    return [...this.categoriesSubject.value];
  }

  /**
   * ✏️ Update a category
   * @param id - Category ID
   * @param dto - Update data
   * @returns The updated category or null if failed
   */
  update(id: string, dto: UpdateCategoryDTO): Category | null {
    const index = this.categoriesSubject.value.findIndex((c) => c.id === id);
    if (index === -1) {
      console.error('❌ Category not found');
      return null;
    }

    const current = this.categoriesSubject.value[index];

    // Validation: Check if new name already exists (excluding current)
    if (dto.name) {
      const nameExists = this.categoriesSubject.value.some(
        (c) =>
          c.id !== id && c.name.toLowerCase() === dto.name!.toLowerCase()
      );
      if (nameExists) {
        console.error('❌ Category name already exists');
        return null;
      }
    }

    const updated = [
      ...this.categoriesSubject.value.slice(0, index),
      {
        ...current,
        ...dto,
        name: dto.name ? dto.name.trim() : current.name,
        color: dto.color && this.validateColor(dto.color) ? dto.color : current.color,
        updatedAt: new Date(),
      },
      ...this.categoriesSubject.value.slice(index + 1),
    ];

    this.storageService.setItem(this.STORAGE_KEY, updated);
    this.categoriesSubject.next(updated);

    console.log(`✅ Category updated: ${updated[index].name}`);
    return updated[index];
  }

  /**
   * 🗑️ Delete a category (only if no active tasks are associated)
   * Business rule: Prevent deletion of categories with pending tasks
   *
   * @param id - Category ID
   * @param activeTasks - Array of active tasks to validate against
   * @returns true if successful, false otherwise
   */
  delete(id: string, activeTasks: any[] = []): boolean {
    // Validation: Check if category has pending tasks
    const hasActiveTasks = activeTasks.some(
      (task) => task.categoryId === id && task.status === 'pending'
    );

    if (hasActiveTasks) {
      console.error(
        '❌ Cannot delete category: it has pending tasks associated'
      );
      return false;
    }

    const updated = this.categoriesSubject.value.filter((c) => c.id !== id);
    this.storageService.setItem(this.STORAGE_KEY, updated);
    this.categoriesSubject.next(updated);

    console.log('✅ Category deleted');
    return true;
  }

  /**
   * 📊 Get category with task count
   * @param categoryId - Category ID
   * @param activeTasksCount - Number of active tasks in this category
   * @returns Updated category with task count
   */
  updateTaskCount(categoryId: string, activeTasksCount: number): void {
    const updated = this.categoriesSubject.value.map((c) =>
      c.id === categoryId ? { ...c, taskCount: activeTasksCount } : c
    );
    this.storageService.setItem(this.STORAGE_KEY, updated);
    this.categoriesSubject.next(updated);
  }

  /**
   * 🔍 Get categories by name (search)
   * @param searchTerm - Search term
   * @returns Observable of filtered categories
   */
  search(searchTerm: string): Observable<Category[]> {
    return this.categories$.pipe(
      map((categories) =>
        categories.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  /**
   * 🆔 Generate unique ID for new category
   * @returns Generated UUID
   */
  private generateId(): string {
    return `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 🎨 Validate hex color format
   * @param color - Color value to validate
   * @returns true if valid hex color
   */
  private validateColor(color: string): boolean {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    return hexColorRegex.test(color);
  }
}
