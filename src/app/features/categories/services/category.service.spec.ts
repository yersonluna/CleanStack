import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { StorageService } from '@app/core/services/storage.service';

// 🧪 Category Service Tests
describe('CategoryService', () => {
  let service: CategoryService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', [
      'getItem',
      'setItem',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: StorageService, useValue: storageSpy },
      ],
    });

    service = TestBed.inject(CategoryService);
    storageServiceSpy = TestBed.inject(
      StorageService
    ) as jasmine.SpyObj<StorageService>;

    storageSpy.getItem.and.returnValue(null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('should create a new category with valid data', () => {
      const dto = { name: 'Work', color: '#FF0000' };
      const category = service.create(dto);

      expect(category).toBeTruthy();
      expect(category?.name).toBe('Work');
      expect(category?.color).toBe('#FF0000');
    });

    it('should return null if name is empty', () => {
      const dto = { name: '', color: '#FF0000' };
      const category = service.create(dto);

      expect(category).toBeNull();
    });

    it('should return null if name already exists', () => {
      service.create({ name: 'Work', color: '#FF0000' });
      const duplicate = service.create({ name: 'Work', color: '#00FF00' });

      expect(duplicate).toBeNull();
    });

    it('should set default color if invalid', () => {
      const dto = { name: 'Personal', color: 'invalid' };
      const category = service.create(dto);

      expect(category?.color).toBe('#808080');
    });
  });

  describe('update', () => {
    it('should update an existing category', () => {
      const created = service.create({ name: 'Work', color: '#FF0000' });

      if (created) {
        const updated = service.update(created.id, {
          name: 'Updated Work',
        });
        expect(updated?.name).toBe('Updated Work');
      }
    });

    it('should return null if category not found', () => {
      const result = service.update('invalid_id', { name: 'New Name' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a category without active tasks', () => {
      const created = service.create({ name: 'Work', color: '#FF0000' });

      if (created) {
        const result = service.delete(created.id, []);
        expect(result).toBe(true);

        const deleted = service.getById(created.id);
        expect(deleted).toBeNull();
      }
    });

    it('should not delete category with pending tasks', () => {
      const created = service.create({ name: 'Work', color: '#FF0000' });

      if (created) {
        const activeTasks = [
          {
            id: 'task1',
            categoryId: created.id,
            status: 'pending',
          },
        ];

        const result = service.delete(created.id, activeTasks);
        expect(result).toBe(false);

        const notDeleted = service.getById(created.id);
        expect(notDeleted).toBeTruthy();
      }
    });
  });
});
