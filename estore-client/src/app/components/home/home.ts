import { Component } from '@angular/core';
import { Header } from './header/header';
import { Catnavigation } from './catnavigation/catnavigation';
import { Sidenavigation } from './sidenavigation/sidenavigation';
import { Products } from '../products/products';
import { Category } from './services/category/category';
import { CategoriesStoreItem } from './services/category/categories.storeitem';
import { ProductsStoreItem } from './services/product/products.storeitem';
import { ProductsService } from './services/product/products.service';
import { SerchKeyword } from './types/searchKeyword.type';
import { RouterOutlet } from '@angular/router';
import { CartStoreItem } from './services/cart/cart.storeitem';
import { WishlistStoreItem } from './services/wishlist/wishlist.storeitem';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserService } from './user/services/user';
import { Order } from './services/order/order';

@Component({
  selector: 'app-home',
  imports: [Header, Catnavigation, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [
    Category,
    CategoriesStoreItem,
    ProductsStoreItem,
    ProductsService,
    RouterOutlet,
    CartStoreItem,
    WishlistStoreItem,
    UserService,
    Order,
  ],
})
export class Home {
  constructor(
    private categoriesStoreItem: CategoriesStoreItem,
    private productsStoreItem: ProductsStoreItem,
    private router: Router,
  ) {
    this.categoriesStoreItem.loadCategories();
    this.productsStoreItem.loadProducts();

    router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      if ((event as NavigationEnd).url === '/home') {
        router.navigate(['/home/products']);
      }
    });
  }
  onSelectCategory(maincategoryid: number): void {
    this.productsStoreItem.loadProducts({ maincategoryid: maincategoryid });
  }

  onSearchKeyword(searchKeyword: SerchKeyword): void {
    this.productsStoreItem.loadProducts({
      maincategoryid: searchKeyword.categoryid,
      keyword: searchKeyword.keyword,
    });
  }
}
