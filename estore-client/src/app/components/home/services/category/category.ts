import { Injectable } from '@angular/core';
import { CategoryInteface } from '../../types/category';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Category {
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<CategoryInteface[]> {
    return this.http.get<CategoryInteface[]>('http://localhost:5001/productcategories');
  }
}
