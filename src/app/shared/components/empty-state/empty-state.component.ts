import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * 🎨 Empty State Component - Reusable component for displaying empty states
 * Used across the app when there are no items to display
 */
@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class EmptyStateComponent {
  // 📝 Customizable properties
  @Input() icon: string = 'checkbox-outline';
  @Input() title: string = 'No items';
  @Input() message: string = 'Get started by creating something new.';
  @Input() emoji: string = '📭';
}
