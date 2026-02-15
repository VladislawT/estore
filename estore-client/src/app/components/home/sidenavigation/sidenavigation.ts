import { Component, inject, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Category } from '../services/category/category';
import { CategoryInteface } from '../types/category';
import { CategoriesStoreItem } from '../services/category/categories.storeitem';

@Component({
  selector: 'app-sidenavigation',
  imports: [FontAwesomeModule],
  templateUrl: './sidenavigation.html',
  styleUrl: './sidenavigation.css',
})
export class Sidenavigation {
  faAngleDown = faAngleDown;
  private categoryStore = inject(CategoriesStoreItem);

  readonly categories = this.categoryStore.categories;

  readonly subCategoryClicked = output<number>();

  getCategories(parentCategoryId?: number): CategoryInteface[] {
    return this.categories().filter((category) =>
      parentCategoryId
        ? category.parent_category_id === parentCategoryId
        : category.parent_category_id === null,
    );
  }
  onSubCategoryClick(subCategory: CategoryInteface): void {
    this.subCategoryClicked.emit(subCategory.id);
  }
}
