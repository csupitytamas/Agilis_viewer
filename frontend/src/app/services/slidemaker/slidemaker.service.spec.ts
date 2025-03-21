import { TestBed } from '@angular/core/testing';

import { SlidemakerService } from './slidemaker.service';

describe('SlidemakerService', () => {
  let service: SlidemakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlidemakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
