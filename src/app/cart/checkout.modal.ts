import { Component, Input } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>Checkout</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="dismiss()">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-list>
      <ion-item>
        <ion-label position="stacked">Full name</ion-label>
        <ion-input [(ngModel)]="order.fullName" placeholder="Full name"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Email</ion-label>
        <ion-input [(ngModel)]="order.email" type="email" placeholder="Email"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Phone</ion-label>
        <ion-input [(ngModel)]="order.phone" type="tel" placeholder="Phone number"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Address</ion-label>
        <ion-textarea [(ngModel)]="order.address" placeholder="Street address"></ion-textarea>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">City</ion-label>
        <ion-input [(ngModel)]="order.city" placeholder="City"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Postal Code</ion-label>
        <ion-input [(ngModel)]="order.postalCode" placeholder="Postal code"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Payment</ion-label>
        <ion-select [(ngModel)]="order.paymentMethod">
          <ion-select-option value="Cash on Delivery">Cash on Delivery</ion-select-option>
          <ion-select-option value="Card">Card (placeholder)</ion-select-option>
        </ion-select>
      </ion-item>
    </ion-list>

    <div class="order-summary ion-padding-top">
      <div *ngFor="let it of cartItems" class="summary-line">
        <div>{{ it.name }} x{{ it.quantity }}</div>
        <div>₱{{ (it.price * it.quantity).toLocaleString() }}</div>
      </div>
      <hr />
      <div class="summary-line total">
        <div>Total</div>
        <div>₱{{ total.toLocaleString() }}</div>
      </div>
    </div>

    <ion-button expand="block" color="success" (click)="confirm()">Confirm Order</ion-button>
    <ion-button expand="block" color="medium" fill="outline" (click)="dismiss()">Cancel</ion-button>
  </ion-content>
  `,
  styles: [
    `
    .order-summary { margin-top: 12px; }
    .summary-line { display:flex; justify-content:space-between; margin-bottom:8px; color: var(--ion-text-color); }
    .summary-line.total { font-weight:800; border-top:1px solid var(--ion-border-color); padding-top:8px; margin-top:8px; }
    `
  ]
})
export class CheckoutModalComponent {
  @Input() cartItems: any[] = [];
  @Input() total = 0;
  @Input() apiUrl = 'http://192.168.1.11:3000';

  order: any = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'Cash on Delivery'
  };

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  async confirm() {
    if (!this.order.fullName || !this.order.address || !this.order.phone) {
      const t = await this.toastCtrl.create({ message: 'Please fill in name, phone, and address', color: 'warning', duration: 2000 });
      await t.present();
      return;
    }

    const payload = {
      customer: this.order,
      items: this.cartItems,
      total: this.total
    };

    this.http.post(`${this.apiUrl}/order`, payload).subscribe({
      next: (res: any) => {
        this.toastCtrl.create({ message: '🎉 Order placed successfully!', color: 'success', duration: 2000 }).then(t => t.present());
        this.modalCtrl.dismiss({ orderPlaced: true, order: res.order });
      },
      error: (err) => {
        console.error('Checkout modal error', err);
        this.toastCtrl.create({ message: '❌ Failed to place order', color: 'danger', duration: 2000 }).then(t => t.present());
      }
    });
  }
}
