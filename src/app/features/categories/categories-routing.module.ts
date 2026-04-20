import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesPage } from './pages/categories.page';

/**
 * 🛣️ Categories Routes Configuration
 */
const routes: Routes = [
  {
    path: '',
    component: CategoriesPage,
  },
];

/**
 * 🛣️ Categories Routing Module - Configures lazy loading routes for categories
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
