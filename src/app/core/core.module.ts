import { NgModule } from '@angular/core';

import { StorageService, ConfigService } from './services';

/**
 * Core Module - Provides singleton services for the entire application
 * Includes storage, configuration, guards, and interceptors
 */
@NgModule({
  providers: [StorageService, ConfigService],
})
export class CoreModule {}
