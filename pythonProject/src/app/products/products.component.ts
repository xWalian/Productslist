import { Component, NgModule, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Product } from './product.model';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../cart/cart.service';
import { CartModule } from '../cart';
import { CartItem } from '../cart/cart-item.model';
import { app } from '../../../server';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'] // Poprawiono styleUrl na styleUrls
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  pagedProducts: Product[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  searchQuery: string = '';

  productForm = new FormGroup({
    quantity: new FormControl('', Validators.required),
  });

  constructor(private appService: AppService, public cartService: CartService) {}

  ngOnInit() {
    this.appService.getProducts().subscribe(
      products => {
        this.allProducts = products;
        this.applyFilters();
      },
      error => {
        console.error('Error loading products:', error);
      }
    );
  }

  applyFilters() {
    this.filteredProducts = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagedProducts();
  }

  updatePagedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredProducts.length);
    this.pagedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  previousPage() {
    this.currentPage--;
    this.updatePagedProducts();
  }

  nextPage() {
    this.currentPage++;
    this.updatePagedProducts();
  }

  search() {
    this.applyFilters();
  }

  addToCart(product: Product){
    const newItem: CartItem = {
      product: product,
      quantity: Number(this.productForm.value.quantity),
    };
    this.cartService.addToCart(newItem)
  }
  isLoggedIn(){
    return this.appService.isLoggedIn
  }
}

@NgModule({
  declarations: [
    ProductsComponent
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
