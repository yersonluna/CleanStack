import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksPage } from './pages/tasks.page';
import { TaskService } from './services/task.service';

/**
 * 📋 Tasks Feature Module - Lazy loaded module for task management
 * Encapsulates all task-related components and services
 */
@NgModule({
  declarations: [TasksPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TasksRoutingModule,
  ],
  providers: [TaskService],
})
export class TasksModule {}
