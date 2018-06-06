import { TestBed, inject } from '@angular/core/testing';

import { TaskNavigationService } from './task-navigation.service';

describe('TaskNavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskNavigationService]
    });
  });

  it('should be created', inject([TaskNavigationService], (service: TaskNavigationService) => {
    expect(service).toBeTruthy();
  }));
});
