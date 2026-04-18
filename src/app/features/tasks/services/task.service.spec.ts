import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { StorageService } from '@app/core/services/storage.service';
import { CategoryService } from '../../categories/services/category.service';

// Task Service Tests
describe('TaskService', () => {
  let service: TaskService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', [
      'getItem',
      'setItem',
      'removeItem',
    ]);
    const categorySpy = jasmine.createSpyObj('CategoryService', [
      'getById',
      'getAll',
      'updateTaskCount',
    ]);

    // Set up spy behaviors before injecting
    storageSpy.getItem.and.returnValue(null);
    categorySpy.getById.and.returnValue({
      id: 'cat1',
      name: 'Test',
      color: '#000000',
      createdAt: new Date(),
    });
    categorySpy.getAll.and.returnValue([]);
    categorySpy.updateTaskCount.and.stub();

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: StorageService, useValue: storageSpy },
        { provide: CategoryService, useValue: categorySpy },
      ],
    });

    service = TestBed.inject(TaskService);
    storageServiceSpy = TestBed.inject(
      StorageService
    ) as jasmine.SpyObj<StorageService>;
    categoryServiceSpy = TestBed.inject(
      CategoryService
    ) as jasmine.SpyObj<CategoryService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('should create a new task with valid data', () => {
      const dto = { title: 'New Task', categoryId: 'cat1' };
      const task = service.create(dto);

      expect(task).toBeTruthy();
      expect(task?.title).toBe('New Task');
      expect(task?.status).toBe('pending');
    });

    it('should return null if title is empty', () => {
      const dto = { title: '', categoryId: 'cat1' };
      const task = service.create(dto);

      expect(task).toBeNull();
    });

    it('should return null if category does not exist', () => {
      categoryServiceSpy.getById.and.returnValue(null);
      const dto = { title: 'New Task', categoryId: 'invalid' };
      const task = service.create(dto);

      expect(task).toBeNull();
    });
  });

  describe('markAsCompleted', () => {
    it('should mark task as completed', () => {
      const dto = { title: 'Task to Complete', categoryId: 'cat1' };
      const created = service.create(dto);

      if (created) {
        const result = service.markAsCompleted(created.id);
        expect(result).toBe(true);

        const updated = service.getById(created.id);
        expect(updated?.status).toBe('completed');
      }
    });
  });

  describe('delete', () => {
    it('should delete a task', () => {
      const dto = { title: 'Task to Delete', categoryId: 'cat1' };
      const created = service.create(dto);

      if (created) {
        const result = service.delete(created.id);
        expect(result).toBe(true);

        const deleted = service.getById(created.id);
        expect(deleted).toBeNull();
      }
    });
  });

  describe('getTaskCounts', () => {
    it('should return correct task counts', () => {
      service.create({ title: 'Task 1', categoryId: 'cat1' });
      const task2 = service.create({ title: 'Task 2', categoryId: 'cat1' });

      if (task2) {
        service.markAsCompleted(task2.id);
      }

      const counts = service.getTaskCounts();
      expect(counts.pending).toBe(1);
      expect(counts.completed).toBe(1);
    });
  });
});
