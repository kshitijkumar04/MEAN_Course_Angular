import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private AuthService:AuthService) { }

  isLoading = false;
  onLogin(form : NgForm){
    if(form.invalid){
      return;
    }
    this.AuthService.loginUser(form.value.email,form.value.password);
  }
  ngOnInit(): void {
  }

}
