import { TestBed } from '@angular/core/testing';

import { LevelsInfoService } from './levels-info.service';

describe('LevelsInfoService', () => {
  let service: LevelsInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelsInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
