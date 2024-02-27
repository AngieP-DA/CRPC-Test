import { TestBed } from '@angular/core/testing';

import { EmulatorConfigService } from './emulator-config.service';

describe('EmulatorConfigService', () => {
  let service: EmulatorConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmulatorConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
