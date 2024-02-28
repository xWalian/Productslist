import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppService } from './app.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  title = 'pythonProject';
  constructor(public appService: AppService, private router: Router) { 
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      if(localStorage.getItem('access_token') != null){
        this.appService.isLoggedIn = true;
      }
    } else {
      console.error('localStorage is not available.');
    }
    
    
  }

  getUsername(){
    return localStorage.getItem('username');
  }

  logout(){
    localStorage.removeItem('username');
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    this.appService.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
