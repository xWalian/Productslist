import { Component, NgModule, OnInit } from '@angular/core';
import { CartItem } from './cart-item.model';
import { CartService } from './cart.service';
import { Order } from '../orders/order.model';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app.routes';
import { AppService } from '../app.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  orders: Order[] = [];

  constructor(private cartService: CartService, private appService: AppService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  removeItemFromCart(item: CartItem): void {
    this.cartService.removeItemFromCart(item);
    this.cartItems = this.cartService.getCartItems();
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  checkout(): void {

    this.orders = this.cartItems.map(item => {
      return {
        product_id: item.product.id,
        quantity: item.quantity,
        status: 'pending', 
        owner: localStorage.getItem('user_id'),
      };
    });
    forkJoin(this.orders.map(order => this.appService.addOrder(order.product_id, order.quantity))).subscribe({
      next: () => {
        console.log('Orders added successfully');
      },
      error: (error) => {
        console.error('Error adding orders:', error);
      }
    });
    this.cartService.clearCart();
    this.cartItems = [];
    
  }

}
@NgModule({
  declarations: [
    CartComponent 
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
})
export class CartModule { }