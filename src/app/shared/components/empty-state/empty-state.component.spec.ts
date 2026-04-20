import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

// 🧪 Empty State Component Tests
describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default icon', () => {
    expect(component.icon).toBe('checkbox-outline');
  });

  it('should display custom message', () => {
    component.title = 'No tasks';
    component.message = 'Create a task to get started';
    fixture.detectChanges();

    expect(component.title).toBe('No tasks');
    expect(component.message).toBe('Create a task to get started');
  });
});
