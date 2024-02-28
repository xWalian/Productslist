// cart.service.ts
import { Injectable } from '@angular/core';
import { CartItem } from './cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];

  constructor() {}

  addToCart(item: CartItem): void {
    const existingItemIndex = this.cartItems.findIndex(cartItem => cartItem.product.id === item.product.id);
    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }
  }

  removeItemFromCart(item: CartItem): void {
    const index = this.cartItems.findIndex(cartItem => cartItem.product.id === item.product.id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  clearCart(): void {
    this.cartItems = [];
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}
