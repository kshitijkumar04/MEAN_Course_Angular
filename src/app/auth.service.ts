import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token:string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer : any;

  constructor(private http:HttpClient, private router:Router) { }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getisAuth(){
    return this.isAuthenticated;
  }

  getToken(){
    return this.token;
  }

  createUser(email:string, password:string){
    const user:AuthData = {email:email, password:password}
    this.http.post("http://localhost:3000/api/user/signup",user).subscribe(
      result =>{
        console.log(result);
      }
    )
  }

  loginUser(email:string, password : string){
    const user:AuthData = {email:email, password:password};
    this.http.post<{token:string, expiresIn: number}>('http://localhost:3000/api/user/login',user).subscribe(
      result => {
        this.token = result.token;     
        if(result.token){
          this.tokenTimer = setTimeout(()=>{
            this.logout();
          }, result.expiresIn *1000)
          this.isAuthenticated = true; 
        this.authStatusListener.next(true);
        this.router.navigate(["/"]);
        }
      }
    )
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(["/"])
  }
}
