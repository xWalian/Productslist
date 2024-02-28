import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { Product } from './products/product.model';
import { Observable } from 'rxjs';
import { Order } from './orders/order.model';

@Injectable({
    providedIn: 'root'
})



export class AppService {
  isLoggedIn = false
    uri = 'http://127.0.0.1:8000';

    constructor(private http: HttpClient, private router: Router) { }

    
    getProducts(): Observable<Product[]> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
        return this.http.get<Product[]>(`${this.uri}/products-list`, { headers: headers });

    }
    getOrders() {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
        return this.http.get<Order[]>(`${this.uri}/order-list`, { headers: headers });
    }
    getOrderById(order_id: number) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
        return this.http.get(`${this.uri}/order-status`, { headers: headers });
    }
    deleteOrder(orderId: number | undefined) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
      return this.http.delete<void>(`${this.uri}/order-delete/${orderId}`, { headers });
    }
    
    addOrder(product_id: number, quantity: number): Observable<any> {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
      const body = {
          product_id: product_id,
          quantity: quantity
      };
      return this.http.post(`${this.uri}/orders-add`, body, { headers: headers });
  }
    addUser(user: any){
      
        return this.http.post<any>(`${this.uri}/auth/create-user`, user).subscribe(
            response => {
              console.log('Utworzono użytkownika:', response);
              this.router.navigate(['/home']);
            },
            error => {
              console.error('Błąd podczas tworzenia użytkownika:', error);
            }
          );
    }
    
    loginUser(user: any) {
      
        this.http.post<any>('http://localhost:8000/auth/token', user).subscribe(
      response => {
        localStorage.setItem('access_token', response.access_token);
        const payload = this.decodeJwt(localStorage.getItem('access_token'));
        localStorage.setItem('username', payload.sub);
        localStorage.setItem('role', payload.role);
        localStorage.setItem('user_id', payload.id);
        this.isLoggedIn = true;
        this.router.navigate(['/home']); 
      },
      error => {
        console.error('Błąd logowania:', error);
      }
      
    );
    }
    // logout() {
    //     localStorage.clear();
    //     this.isLoggedIn = false;
    // }
    decodeJwt(token: any) {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    }
    
}
