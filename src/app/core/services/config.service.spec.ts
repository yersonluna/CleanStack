import { TestBed } from '@angular/core/testing';
import { ConfigService, FeatureFlags } from './config.service';

// 🧪 Config Service Tests - Validates feature flag management
describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Feature Flags Initialization', () => {
    it('should have default feature flags', () => {
      const flags = service.getAllFlags();

      expect(flags.enable_category_filter).toBe(true);
      expect(flags.enable_task_priority).toBe(false);
      expect(flags.enable_task_reminder).toBe(false);
    });
  });

  describe('getFlag', () => {
    it('should return specific flag value', () => {
      const value = service.getFlag('enable_category_filter');

      expect(value).toBe(true);
    });
  });

  describe('getAllFlags', () => {
    it('should return all flags', () => {
      const flags = service.getAllFlags();

      expect(flags).toHaveProperty('enable_category_filter');
      expect(flags).toHaveProperty('enable_task_priority');
      expect(flags).toHaveProperty('enable_task_reminder');
    });
  });

  describe('setFlags', () => {
    it('should update feature flags', (done) => {
      const newFlags: Partial<FeatureFlags> = {
        enable_category_filter: false,
        enable_task_priority: true,
      };

      service.setFlags(newFlags);

      service.featureFlags$.subscribe((flags) => {
        expect(flags.enable_category_filter).toBe(false);
        expect(flags.enable_task_priority).toBe(true);
        expect(flags.enable_task_reminder).toBe(false);
        done();
      });
    });
  });

  describe('getFlag$', () => {
    it('should return observable of flag value', (done) => {
      service.getFlag$('enable_category_filter').subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
    });

    it('should emit new values when flags change', (done) => {
      const values: boolean[] = [];

      service.getFlag$('enable_task_priority').subscribe((value) => {
        values.push(value);
        if (values.length === 2) {
          expect(values).toEqual([false, true]);
          done();
        }
      });

      setTimeout(() => {
        service.setFlags({ enable_task_priority: true });
      }, 100);
    });
  });
});
