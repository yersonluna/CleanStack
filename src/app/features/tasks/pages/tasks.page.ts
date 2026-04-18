import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task, Category } from '@app/shared/models';
import { TaskService } from '../services/task.service';
import { ConfigService } from '@app/core/services';
import { CategoryService } from '../../categories/services/category.service';

/**
 * 📋 Tasks Page Component - Main container for task management
 * Displays task list with filtering and CRUD operations
 * 
 * Performance optimizations:
 * - ChangeDetectionStrategy.OnPush for better performance
 * - Signal-based state for reactive updates
 * - Proper subscription management with takeUntil
 * - trackBy function for ngFor optimization
 */
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TasksPage implements OnInit, OnDestroy {
  // 📋 Observables from services
  tasks$ = this.taskService.filteredTasks$;
  categories$ = this.categoryService.categories$;
  featureFlags$ = this.configService.featureFlags$;

  // Helper state computed from signal
  get loading(): boolean {
    return this.isLoading();
  }

  // 📝 Form for creating new task
  taskForm!: FormGroup;

  // 🎯 State signals
  editingTaskId = signal<string | null>(null);
  isLoading = signal(false);
  showEmptyState = signal(true);

  // 🧹 Cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private configService: ConfigService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private toastController: ToastController
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Monitor tasks to show/hide empty state
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
      this.showEmptyState.set(tasks.length === 0);
    });

    // Refresh feature flags on init
    this.configService.refreshFeatureFlags().catch((error) => {
      console.error('Failed to refresh feature flags:', error);
    });
  }

  /**
   * ✍️ Initialize task form
   */
  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      categoryId: ['', Validators.required],
    });
  }

  /**
   * ➕ Create a new task
   */
  addTask(): void {
    if (this.taskForm.invalid) {
      this.showToast('❌ Please fill in all required fields', 'danger');
      return;
    }

    this.isLoading.set(true);

    try {
      const newTask = this.taskService.create(this.taskForm.value);
      if (newTask) {
        this.showToast(`✅ Task "${newTask.title}" created`, 'success');
        this.taskForm.reset();
      } else {
        this.showToast('❌ Failed to create task', 'danger');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      this.showToast('❌ Error creating task', 'danger');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * ✅ Toggle task completion
   */
  toggleComplete(task: Task): void {
    try {
      if (task.status === 'completed') {
        this.taskService.reopenTask(task.id);
        this.showToast(`↩️ Task reopened`, 'success');
      } else {
        this.taskService.markAsCompleted(task.id);
        this.showToast(`✅ Task completed`, 'success');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      this.showToast('❌ Error updating task', 'danger');
    }
  }

  /**
   * ✏️ Start editing a task
   */
  editTask(task: Task): void {
    this.editingTaskId.set(task.id);
    // TODO: Open modal with editable form
  }

  /**
   * 🗑️ Delete a task
   */
  deleteTask(task: Task): void {
    try {
      const success = this.taskService.delete(task.id);
      if (success) {
        this.showToast(`🗑️ Task deleted`, 'success');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      this.showToast('❌ Error deleting task', 'danger');
    }
  }

  /**
   * 🎯 Filter tasks by category
   */
  filterByCategory(categoryId: string | number | null | undefined): void {
    const id = categoryId === 'null' || categoryId == null ? null : String(categoryId);
    this.taskService.setFilter(id);
  }

  /**
   * 🔍 Track by function for ngFor optimization (Tasks)
   */
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  /**
   * 🔍 Track by function for ngFor optimization (Categories)
   */
  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }

  /**
   * 💬 Show toast message
   */
  private async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

