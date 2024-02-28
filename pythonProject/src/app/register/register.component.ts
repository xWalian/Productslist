import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { app } from '../../../server';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private appService: AppService, private router: Router) {}


  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    role: new FormControl('customer')
  });

  ngOnInit(): void{
    if (this.appService.isLoggedIn) {
      this.router.navigate(['/home']); 
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const formData = this.registerForm.value;
    alert(this.registerForm.value);
    this.appService.addUser(formData);
  }
}


@NgModule({
  declarations: [RegisterComponent],
  imports: [ReactiveFormsModule],
  exports: [RegisterComponent]
})
export class RegisterModule { }