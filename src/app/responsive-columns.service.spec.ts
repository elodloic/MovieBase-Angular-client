import { TestBed } from '@angular/core/testing';

import { ResponsiveColumnsService } from './responsive-columns.service';

describe('ResponsiveColumnsService', () => {
  let service: ResponsiveColumnsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsiveColumnsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
