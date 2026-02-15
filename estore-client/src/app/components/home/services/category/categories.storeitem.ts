import { computed, Injectable, signal } from '@angular/core';
import { CategoryInteface } from '../../types/category';
import { Category } from '../category/category';

@Injectable()
export class CategoriesStoreItem {
  private readonly _categories = signal<CategoryInteface[]>([]);

  readonly categories = this._categories.asReadonly();

  readonly topLevelCategories = computed(() =>
    this._categories().filter((category) => category.parent_category_id === null),
  );

  constructor(private categoryService: Category) {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService
      .getAllCategories()
      .subscribe((categories) => this._categories.set(categories));
  }
}
