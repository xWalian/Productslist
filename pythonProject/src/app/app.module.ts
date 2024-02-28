import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HomeComponent } from "./home";
import { AppRoutingModule } from "./app.routes";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppService } from "./app.service";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [BrowserModule, AppRoutingModule, RouterOutlet, CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule, FormsModule, ],
    declarations: [
        HomeComponent,
    ],
    providers: [
        AppService,
  ],
})
export class AppModule{}