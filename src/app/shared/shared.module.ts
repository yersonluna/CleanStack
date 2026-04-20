import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

/**
 * Shared Module - Exports reusable components, pipes, and services
 * Provides shared UI elements and utilities across features
 */
@NgModule({
  declarations: [EmptyStateComponent, TimeAgoPipe],
  imports: [CommonModule, IonicModule],
  exports: [EmptyStateComponent, TimeAgoPipe, CommonModule, IonicModule],
})
export class SharedModule {}
