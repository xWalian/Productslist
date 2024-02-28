import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private appService: AppService, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void{
    if (this.appService.isLoggedIn) {
      this.router.navigate(['/home']); 
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('username', `${this.loginForm.value.password}`);
    formData.append('password', `${this.loginForm.value.password}`);
    console.log(formData);
    this.appService.loginUser(formData);
  }
}
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
})
export class AppModule { }
