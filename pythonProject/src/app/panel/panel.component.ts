import { Component, NgModule, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Order } from '../orders/order.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CartModule } from '../cart';



@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  userOrders: Order[] = [];

  constructor(private appService: AppService) { }
  
  ngOnInit(): void {
    this.getUserOrders();
  }

  getUserOrders(): void {
    this.appService.getOrders().subscribe(
      (orders: Order[]) => {
        this.userOrders = orders;
      },
      error => {
        console.error('Error loading user orders:', error);
      }
    );
  }
  deleteOrder(orderId: number | undefined): void {
    this.appService.deleteOrder(orderId).subscribe(
      () => {
        this.getUserOrders();
        console.log('Order deleted successfully.');
      },
      error => {
        console.error('Error deleting order:', error);
      }
    );
  }
}

@NgModule({
  declarations: [
    PanelComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    CartModule
  ],
  providers: [],
})
export class ProductsModule { }
