import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TasksPage } from './pages/tasks.page';

/**
 * 🛣️ Tasks Routes Configuration
 */
const routes: Routes = [
  {
    path: '',
    component: TasksPage,
  },
];

/**
 * 🛣️ Tasks Routing Module - Configures lazy loading routes for tasks
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
