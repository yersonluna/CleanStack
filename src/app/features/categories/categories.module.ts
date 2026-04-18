import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesPage } from './pages/categories.page';
import { CategoryService } from './services/category.service';

/**
 * 🏷️ Categories Feature Module - Lazy loaded module for category management
 * Encapsulates all category-related components and services
 */
@NgModule({
  declarations: [CategoriesPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CategoriesRoutingModule,
  ],
  providers: [CategoryService],
})
export class CategoriesModule {}
