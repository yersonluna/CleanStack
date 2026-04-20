import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '@app/shared/models';
import { CategoryService } from '../services/category.service';
import { TaskService } from '../../tasks/services/task.service';

/**
 * 🏷️ Categories Page Component - Manage task categories
 * Displays category list with CRUD operations and business validations
 * 
 * Performance optimizations:
 * - ChangeDetectionStrategy.OnPush for better performance
 * - Signal-based state for reactive updates
 * - Proper subscription management with takeUntil
 * - trackBy function for ngFor optimization
 */
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CategoriesPage implements OnInit, OnDestroy {
  // 📋 Observable from service
  categories$ = this.categoryService.categories$;

  // 📝 Form for creating new category
  categoryForm!: FormGroup;

  // 🎯 State signals
  editingCategoryId = signal<string | null>(null);
  isLoading = signal(false);
  showEmptyState = signal(true);

  // 🧹 Cleanup
  private destroy$ = new Subject<void>();

  // 🎨 Available colors for categories
  readonly COLORS = [
    '#FF5733', // Red
    '#33FF57', // Green
    '#3357FF', // Blue
    '#FF33F5', // Purple
    '#FFC300', // Yellow
    '#FF9500', // Orange
    '#00CED1', // Turquoise
    '#FF1493', // Pink
  ];

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private fb: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Monitor categories to show/hide empty state
    this.categories$.pipe(takeUntil(this.destroy$)).subscribe((categories) => {
      this.showEmptyState.set(categories.length === 0);
    });
  }

  /**
   * ✍️ Initialize category form
   */
  private initializeForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      color: ['#FF5733', Validators.required],
    });
  }

  /**
   * ➕ Create a new category
   */
  addCategory(): void {
    if (this.categoryForm.invalid) {
      this.showToast('❌ Please fill in all required fields', 'danger');
      return;
    }

    this.isLoading.set(true);

    try {
      const newCategory = this.categoryService.create(this.categoryForm.value);
      if (newCategory) {
        this.showToast(`✅ Category "${newCategory.name}" created`, 'success');
        this.categoryForm.reset({ color: '#FF5733' });
      } else {
        this.showToast('❌ Failed to create category', 'danger');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      this.showToast('❌ Error creating category', 'danger');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * ✏️ Start editing a category
   */
  async editCategory(category: Category): Promise<void> {
    const alert = await this.alertController.create({
      header: `✏️ Edit "${category.name}"`,
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: category.name,
          placeholder: 'Category name',
        },
      ],
      buttons: [
        {
          text: '❌ Cancel',
          role: 'cancel',
        },
        {
          text: '✅ Save',
          handler: (data: { name: string }) => {
            try {
              const updated = this.categoryService.update(category.id, {
                name: data.name,
              });
              if (updated) {
                this.showToast(`✅ Category updated`, 'success');
              }
            } catch (error) {
              this.showToast('❌ Error updating category', 'danger');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * 🗑️ Delete a category with validation
   */
  async deleteCategory(category: Category): Promise<void> {
    const alert = await this.alertController.create({
      header: `🗑️ Delete "${category.name}"?`,
      message:
        'This will only delete the category if there are no pending tasks associated with it.',
      buttons: [
        {
          text: '❌ Cancel',
          role: 'cancel',
        },
        {
          text: '🗑️ Delete',
          role: 'destructive',
          handler: () => {
            try {
              const tasks = this.taskService.getAll();
              const success = this.categoryService.delete(category.id, tasks);

              if (success) {
                this.showToast(`✅ Category deleted`, 'success');
              } else {
                this.showToast(
                  '⚠️ Cannot delete: category has pending tasks',
                  'warning'
                );
              }
            } catch (error) {
              this.showToast('❌ Error deleting category', 'danger');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * 🎨 Set color for category form
   */
  setColor(color: string): void {
    this.categoryForm.patchValue({ color });
  }

  /**
   * 🔍 Track by function for ngFor optimization
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
