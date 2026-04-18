import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// 🚩 Feature Flags Configuration - Contains all available feature flags
export interface FeatureFlags {
  enable_category_filter: boolean;
  enable_task_priority: boolean;
  enable_task_reminder: boolean;
}

/**
 * ☁️ Config Service - Manages Feature Flags from Firebase Remote Config
 * 
 * Note: For full Firebase integration, inject AngularFireRemoteConfig and use:
 * this.remoteConfig.getAll()
 * this.remoteConfig.getBoolean('enable_category_filter')
 * this.remoteConfig.activate()
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // 📦 Default feature flags (fallback values)
  private readonly DEFAULT_FLAGS: FeatureFlags = {
    enable_category_filter: true,
    enable_task_priority: false,
    enable_task_reminder: false,
  };

  // 🔄 Observable source for feature flags
  private featureFlagsSubject = new BehaviorSubject<FeatureFlags>(
    this.DEFAULT_FLAGS
  );

  // 📡 Public observable for components to subscribe to
  public featureFlags$: Observable<FeatureFlags> =
    this.featureFlagsSubject.asObservable();

  constructor() {
    // Initialize configuration (load from Firebase in production)
    this.initializeConfig();
  }

  /**
   * ⚙️ Initialize configuration from Firebase Remote Config
   * Replace with actual Firebase integration when available
   */
  private initializeConfig(): void {
    // TODO: Implement Firebase Remote Config initialization
    // For now, using default values
    // In production:
    // - Call Firebase remoteConfig.ensureInitialized()
    // - Set cache expiration
    // - Update local subject with fetched values
  }

  /**
   * 🔄 Refresh feature flags from Firebase
   * Should be called periodically (e.g., on app resume)
   */
  async refreshFeatureFlags(): Promise<void> {
    try {
      // TODO: Implement Firebase refresh logic
      // const remoteConfig = inject(RemoteConfigService);
      // await remoteConfig.fetchAndActivate();
      // const flags = this.mapRemoteConfigToFlags(remoteConfig);
      // this.featureFlagsSubject.next(flags);
      console.log('✅ Feature flags refreshed');
    } catch (error) {
      console.error('❌ Failed to refresh feature flags:', error);
    }
  }

  /**
   * 🚩 Get a specific feature flag value (synchronous)
   * @param flagName - Name of the feature flag
   * @returns The flag value or default if not found
   */
  getFlag<K extends keyof FeatureFlags>(flagName: K): FeatureFlags[K] {
    return this.featureFlagsSubject.value[flagName];
  }

  /**
   * 🔍 Get all feature flags
   * @returns Current feature flags object
   */
  getAllFlags(): FeatureFlags {
    return this.featureFlagsSubject.value;
  }

  /**
   * 📡 Get observable for a specific flag
   * @param flagName - Name of the feature flag
   * @returns Observable of the flag value
   */
  getFlag$<K extends keyof FeatureFlags>(flagName: K): Observable<boolean> {
    return new Observable((subscriber) => {
      subscriber.next(this.featureFlagsSubject.value[flagName]);
      const sub = this.featureFlagsSubject.subscribe((flags) => {
        subscriber.next(flags[flagName]);
      });
      return () => sub.unsubscribe();
    });
  }

  /**
   * 🔧 Update feature flags (for testing or manual override)
   * @param flags - Partial feature flags to merge
   */
  setFlags(flags: Partial<FeatureFlags>): void {
    const currentFlags = this.featureFlagsSubject.value;
    this.featureFlagsSubject.next({
      ...currentFlags,
      ...flags,
    });
  }
}
