import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import {Post} from './post.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService){}
  
  // Posts:Post[] = [];
  // getPost(post){
  //   this.Posts.push(post);
  // }

  ngOnInit(){
    this.authService.auotAuthUser();
  }
}
