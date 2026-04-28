import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CheckoutModalComponent } from './checkout.modal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, HttpClientModule, FormsModule],
})
export class CartPage implements OnInit {

  apiUrl = 'http://192.168.1.11:3000';
  cartItems: any[] = [];

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCart();
  }

  ionViewWillEnter() {
    this.getCart();
  }

  getCart() {
    this.http.get<any[]>(`${this.apiUrl}/cart`).subscribe({
      next: (data) => {
        this.cartItems = data;
      },
      error: (err) => {
        console.error('Cart fetch error:', err);
        this.showToast('❌ Failed to load cart', 'danger');
      }
    });
  }

  increaseQuantity(id: number) {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      item.quantity += 1;
      this.updateCartItem(item);
    }
  }

  decreaseQuantity(id: number) {
    const item = this.cartItems.find(i => i.id === id);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.updateCartItem(item);
    } else if (item && item.quantity === 1) {
      this.removeFromCart(id);
    }
  }

  async openCheckoutModal() {
    const modal = await this.modalCtrl.create({
      component: CheckoutModalComponent,
      componentProps: {
        cartItems: this.cartItems,
        total: this.total,
        apiUrl: this.apiUrl
      },
      // Present as a centered modal instead of bottom sheet
      cssClass: 'checkout-modal centered-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.orderPlaced) {
      this.cartItems = [];
      this.getCart();
      this.showToast('🎉 Order placed successfully!', 'success');
      this.router.navigate(['/home']);
    }
  }

  updateCartItem(item: any) {
    this.http.post(`${this.apiUrl}/cart/update`, { id: item.id, quantity: item.quantity }).subscribe({
      next: () => {
        this.showToast('✅ Quantity updated', 'success');
      },
      error: () => {
        this.showToast('❌ Failed to update quantity', 'danger');
        this.getCart();
      }
    });
  }

  removeFromCart(id: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    // Sync with backend
    this.http.post(`${this.apiUrl}/cart/remove`, { id }).subscribe({
      next: () => {
        this.getCart();
        this.showToast('✅ Item removed', 'success');
      },
      error: () => {
        this.showToast('❌ Failed to remove item', 'danger');
      }
    });
  }

  get total() {
  return this.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

  placeOrder() {
    if (this.cartItems.length === 0) {
      this.showToast('🛒 Cart is empty', 'warning');
      return;
    }

    this.http.delete(`${this.apiUrl}/cart`).subscribe({
      next: () => {
        // Clear local cart and re-sync with backend, then navigate home
        this.cartItems = [];
        this.getCart();
        this.showToast('🎉 Order placed successfully!', 'success');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Order error:', err);
        this.showToast('❌ Failed to place order', 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}