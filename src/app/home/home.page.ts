import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
})
export class HomePage implements OnInit {

  apiUrl = 'http://smartshop-backend.up.railway.app';

  items: any[] = [];
  cartItems: any[] = [];

  selectedCategory = 'All';
  searchQuery = '';
  isLoading = true;
  userLocation = '';

  categories = ['All', 'Gadgets', 'Fashion', 'School', 'Home', 'Lifestyle'];

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController
    ,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchProducts();
    this.fetchCart(); // Fetch to show cart count in badge
    this.getLocation();
  }

  ionViewWillEnter() {
    // Refresh cart when returning to this view (updates badge/count)
    this.fetchCart();
  }

  fetchProducts() {
    this.isLoading = true;
    this.http.get<any[]>(`${this.apiUrl}/products`).subscribe({
      next: (data) => {
        this.items = data.map(i => ({ ...i, liked: false }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Server error', 'danger');
      }
    });
  }

  fetchCart() {
    this.http.get<any[]>(`${this.apiUrl}/cart`).subscribe(data => {
      this.cartItems = data;
    });
  }

  addToCart(item: any) {
    // Send only required fields to backend
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img
    };

    this.http.post(`${this.apiUrl}/cart`, cartItem).subscribe({
      next: () => {
        this.fetchCart(); // Refresh cart after adding
        this.showToast(`✅ ${item.name} added to cart!`, 'success');
      },
      error: (err) => {
        console.error('Add to cart error:', err);
        this.showToast('❌ Failed to add to cart', 'danger');
      }
    });
  }

  buyNow(item: any) {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img
    };

    this.http.post(`${this.apiUrl}/cart`, cartItem).subscribe({
      next: () => {
        this.fetchCart();
        this.showToast(`✅ ${item.name} added to cart!`, 'success');
        this.router.navigate(['/cart']);
      },
      error: (err) => {
        console.error('Buy now error:', err);
        this.showToast('❌ Failed to process Buy Now', 'danger');
      }
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.userLocation =
            `📍 ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        },
        () => this.userLocation = '📍 Location unavailable'
      );
    }
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }

  toggleWishlist(item: any) {
    item.liked = !item.liked;
  }

  getStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? '★' : '☆'
    );
  }

  get filteredItems() {
    return this.items.filter(i => {
      const matchCat =
        this.selectedCategory === 'All' ||
        i.category === this.selectedCategory;

      const matchSearch =
        i.name.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchCat && matchSearch;
    });
  }

  get cartCount() {
    return this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}