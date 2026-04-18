import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskStatus } from '@app/shared/models';
import { StorageService } from '@app/core/services';
import { CategoryService } from '../../categories/services/category.service';

/**
 * 📋 Task Service - Business logic for task management
 * Handles CRUD operations, filtering, and reactive state management
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly STORAGE_KEY = 'tasks';

  // 🔄 BehaviorSubject to share task state across the app
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  // 🔍 Filter state - currently selected category
  private selectedCategorySubject = new BehaviorSubject<string | null>(null);
  public selectedCategory$ = this.selectedCategorySubject.asObservable();

  // 📊 Computed: Filtered tasks observable
  public filteredTasks$: Observable<Task[]> = combineLatest([
    this.tasks$,
    this.selectedCategory$,
  ]).pipe(
    map(([tasks, categoryId]) =>
      categoryId ? tasks.filter((t) => t.categoryId === categoryId) : tasks
    )
  );

  constructor(
    private storageService: StorageService,
    private categoryService: CategoryService
  ) {
    this.loadTasks();
  }

  /**
   * 📂 Load all tasks from storage
   * Called on service initialization and after CRUD operations
   */
  private loadTasks(): void {
    const stored = this.storageService.getItem<Task[]>(this.STORAGE_KEY);
    const tasks = (stored || []).map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
      completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
    }));
    this.tasksSubject.next(tasks);
    this.updateCategoryCounts();
  }

  /**
   * ➕ Create a new task
   * @param dto - Create task data
   * @returns The created task or null if validation fails
   */
  create(dto: CreateTaskDTO): Task | null {
    // Validation: Check if title is empty
    if (!dto.title || dto.title.trim().length === 0) {
      console.error('❌ Task title cannot be empty');
      return null;
    }

    // Validation: Check if category exists
    const category = this.categoryService.getById(dto.categoryId);
    if (!category) {
      console.error('❌ Category not found');
      return null;
    }

    // Create new task
    const newTask: Task = {
      id: this.generateId(),
      title: dto.title.trim(),
      description: dto.description?.trim() || undefined,
      status: 'pending',
      categoryId: dto.categoryId,
      createdAt: new Date(),
    };

    // Update state and persist
    const updated = [...this.tasksSubject.value, newTask];
    this.storageService.setItem(this.STORAGE_KEY, updated);
    this.tasksSubject.next(updated);
    this.updateCategoryCounts();

    console.log(`✅ Task created: ${newTask.title}`);
    return newTask;
  }

  /**
   * 👁️ Get a task by ID
   * @param id - Task ID
   * @returns The task or null if not found
   */
  getById(id: string): Task | null {
    return this.tasksSubject.value.find((t) => t.id === id) || null;
  }

  /**
   * 🔍 Get all tasks
   * @returns Array of all tasks
   */
  getAll(): Task[] {
    return [...this.tasksSubject.value];
  }

  /**
   * ✏️ Update a task
   * @param id - Task ID
   * @param dto - Update data
   * @returns The updated task or null if failed
   */
  update(id: string, dto: UpdateTaskDTO): Task | null {
    const index = this.tasksSubject.value.findIndex((t) => t.id === id);
    if (index === -1) {
      console.error('❌ Task not found');
      return null;
    }

    const current = this.tasksSubject.value[index];

    // Validation: If updating categoryId, check if category exists
    if (dto.categoryId && !this.categoryService.getById(dto.categoryId)) {
      console.error('❌ Category not found');
      return null;
    }

    const updated = [
      ...this.tasksSubject.value.slice(0, index),
      {
        ...current,
        ...dto,
        title: dto.title ? dto.title.trim() : current.title,
        description: dto.description ? dto.description.trim() : current.description,
        updatedAt: new Date(),
        completedAt:
          dto.status === 'completed' && current.status !== 'completed'
            ? new Date()
            : dto.status === 'pending'
              ? undefined
              : current.completedAt,
      },
      ...this.tasksSubject.value.slice(index + 1),
    ];

    this.storageService.setItem(this.STORAGE_KEY, updated);
    this.tasksSubject.next(updated);
    this.updateCategoryCounts();

    console.log(`✅ Task updated: ${updated[index].title}`);
    return updated[index];
  }

  /**
   * ✅ Mark task as completed
   * @param id - Task ID
   * @returns true if successful
   */
  markAsCompleted(id: string): boolean {
    const task = this.getById(id);
    if (!task) {
      return false;
    }

    return this.update(id, { status: 'completed' }) !== null;
  }

  /**
   * ↩️ Reopen a completed task
   * @param id - Task ID
   * @returns true if successful
   */
  reopenTask(id: string): boolean {
    const task = this.getById(id);
    if (!task) {
      return false;
    }

    return this.update(id, { status: 'pending' }) !== null;
  }

  /**
   * 🗑️ Delete a task
   * @param id - Task ID
   * @returns true if successful
   */
  delete(id: string): boolean {
    const updated = this.tasksSubject.value.filter((t) => t.id !== id);
    this.storageService.setItem(this.STORAGE_KEY, updated);
    this.tasksSubject.next(updated);
    this.updateCategoryCounts();

    console.log('✅ Task deleted');
    return true;
  }

  /**
   * 📊 Get tasks by status
   * @param status - Task status filter
   * @returns Observable of tasks with given status
   */
  getByStatus(status: TaskStatus): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) => tasks.filter((t) => t.status === status))
    );
  }

  /**
   * 📂 Get tasks by category
   * @param categoryId - Category ID
   * @returns Observable of tasks in given category
   */
  getByCategory(categoryId: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) => tasks.filter((t) => t.categoryId === categoryId))
    );
  }

  /**
   * 🔍 Search tasks by title or description
   * @param searchTerm - Search term
   * @returns Observable of filtered tasks
   */
  search(searchTerm: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) =>
        tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.description &&
              t.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      )
    );
  }

  /**
   * 🎯 Set active category filter
   * @param categoryId - Category ID to filter by (null to clear filter)
   */
  setFilter(categoryId: string | null): void {
    this.selectedCategorySubject.next(categoryId);
  }

  /**
   * 📊 Get tasks count by status
   * @returns Object with counts for each status
   */
  getTaskCounts(): { pending: number; completed: number } {
    const tasks = this.tasksSubject.value;
    return {
      pending: tasks.filter((t) => t.status === 'pending').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    };
  }

  /**
   * 🔄 Update category task counts
   * Should be called after any task modification
   */
  private updateCategoryCounts(): void {
    const tasks = this.tasksSubject.value;
    const categories = this.categoryService.getAll();

    categories.forEach((category) => {
      const count = tasks.filter(
        (t) => t.categoryId === category.id && t.status === 'pending'
      ).length;
      this.categoryService.updateTaskCount(category.id, count);
    });
  }

  /**
   * 🆔 Generate unique ID for new task
   * @returns Generated UUID
   */
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
