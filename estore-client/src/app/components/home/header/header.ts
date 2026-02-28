import { Component, effect, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faUserCircle,
  faShoppingCart,
  faChevronDown,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { CategoriesStoreItem } from '../services/category/categories.storeitem';
import { SerchKeyword } from '../types/searchKeyword.type';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { CartStoreItem } from '../services/cart/cart.storeitem';
import { WishlistStoreItem } from '../services/wishlist/wishlist.storeitem';
import { UserService } from '../user/services/user';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  faSearch = faSearch;
  faUserCircle = faUserCircle;
  faShoppingCart = faShoppingCart;
  faChevronDown = faChevronDown;
  faHeart = faHeart;

  dropdownVisable = false;

  toggleDropdown() {
    this.dropdownVisable = !this.dropdownVisable;
  }

  readonly searchClicked = output<SerchKeyword>();
  displaySerch = signal(true);
  isUserAuthenticated = signal(false);
  userName = signal('');

  constructor(
    public categoryStore: CategoriesStoreItem,
    private router: Router,
    public cart: CartStoreItem,
    public wishlist: WishlistStoreItem,
    public userService: UserService,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.displaySerch.set(event.url === '/home/products');
      });

    const isUserAuthenticatedSignal = toSignal(this.userService.isUserAuthenticated$, {
      initialValue: false,
    });
    const loggedInUserSiganl = toSignal(this.userService.loggedInUser$, {
      initialValue: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        pin: '',
        email: '',
      },
    });

    effect(() => {
      this.isUserAuthenticated.set(isUserAuthenticatedSignal());
      this.userName.set(loggedInUserSiganl().firstName);
    });
  }

  onClickSearch(keyword: string, categoryid: string): void {
    this.searchClicked.emit({
      categoryid: parseInt(categoryid),
      keyword: keyword,
    });
  }

  navigateToCart(): void {
    this.router.navigate(['home/cart']);
  }

  logout(): void {
    this.userService.logout();
  }
}
