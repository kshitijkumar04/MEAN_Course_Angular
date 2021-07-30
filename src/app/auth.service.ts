import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

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
    this.http.post('http://localhost:3000/api/user/login',user).subscribe(
      result => {
        console.log(result);
        
      }
    )

  }
}