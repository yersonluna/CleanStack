import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

// 🧪 Storage Service Tests - Validates CRUD operations and error handling
describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should store item in localStorage', () => {
      const testData = { id: 1, name: 'Test' };
      const result = service.setItem('test', testData);

      expect(result).toBe(true);
      expect(localStorage.getItem('test')).toBe(JSON.stringify(testData));
    });
  });

  describe('getItem', () => {
    it('should retrieve item from localStorage', () => {
      const testData = { id: 1, name: 'Test' };
      localStorage.setItem('test', JSON.stringify(testData));

      const result = service.getItem('test');

      expect(result).toEqual(testData);
    });

    it('should return null if item not found', () => {
      const result = service.getItem('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null on parse error', () => {
      localStorage.setItem('invalid', 'invalid json {]');

      const result = service.getItem('invalid');

      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem('test', 'value');

      const result = service.removeItem('test');

      expect(result).toBe(true);
      expect(localStorage.getItem('test')).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all localStorage', () => {
      localStorage.setItem('item1', 'value1');
      localStorage.setItem('item2', 'value2');

      const result = service.clear();

      expect(result).toBe(true);
      expect(localStorage.length).toBe(0);
    });
  });

  describe('hasItem', () => {
    it('should return true if item exists', () => {
      localStorage.setItem('test', 'value');

      const result = service.hasItem('test');

      expect(result).toBe(true);
    });

    it('should return false if item does not exist', () => {
      const result = service.hasItem('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('keys', () => {
    it('should return all keys from localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');

      const result = service.keys();

      expect(result).toContain('key1');
      expect(result).toContain('key2');
      expect(result.length).toBe(2);
    });
  });
});
