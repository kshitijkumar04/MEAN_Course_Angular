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
        this.setAuthTimer(result.expiresIn);
        this.isAuthenticated = true; 
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime()+ result.expiresIn *1000);
        this.saveAuthData(result.token, expirationDate);
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
    this.clearAuthData();
    this.router.navigate(["/"])
  }

  auotAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);
    }

  }

  setAuthTimer(duration:number){
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    }, duration *1000)

  }


  private saveAuthData(token: string, expirationDate: Date){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if(!token || !expirationDate){
      return;
    }
    return {
      token : token,
      expirationDate : new Date(expirationDate)
    }
  }
}
