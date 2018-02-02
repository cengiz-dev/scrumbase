import { inject, TestBed } from '@angular/core/testing';

import { Category } from '../products/category.model';
import { Product } from '../products/product.model';
import { FirebaseDataService } from './firebase-data.service';

const mockProducts: Product[] = [
    new Product('Elma', Category.FOOD, 'Organik elma', 'Image Path'),
    new Product('Portakal', Category.FOOD, 'Organik portakal', 'Image Path'),
    new Product('Bebek Body', Category.CLOTHING, 'Organik pamuklu bebek body', 'Image Path')
  ];

describe('FirebaseDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseDataService]
    });
  });

  it('should be created', inject([FirebaseDataService], (service: FirebaseDataService) => {
    expect(service).toBeTruthy();
  }));
});
