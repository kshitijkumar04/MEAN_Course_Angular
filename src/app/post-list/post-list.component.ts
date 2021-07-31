import { Component, OnDestroy, OnInit } from '@angular/core';
import {Post} from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  constructor(public postService:PostsService, private authService:AuthService) { }
   
  // posts = [
  //   {title: 'First Post' , content: `first post's content`},
  //   {title: 'Second Post' , content: `second post's content`},
  //   {title: 'Third Post' , content: `third post's content`}
  // ]
  posts:Post[] = [];
  private postSub: Subscription;
  private authListenerSubs:Subscription;
  userAuthenticated= false;
  isLoading = false;
  totalPosts :number;
  postsPerPage = 2;
  currentPage = 1; 
  pageSizeOptions = [2,5,10];

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.currentPage, this.postsPerPage);
    this.postSub = this.postService.getPostUpdateListener().subscribe( (postData:{posts: Post[], postCount:number}) => {
      this.isLoading = false;
      this.posts= postData.posts;
      this.totalPosts = postData.postCount
    })
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(result=>{
      this.userAuthenticated = result;
    });
    this.userAuthenticated = this.authService.getisAuth();
  }

  deletePost(id : string){
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(()=>{
      this.postService.getPosts(this.currentPage, this.postsPerPage);
    });
    
  }

  onPageChange(event: PageEvent){
    this.isLoading = true;
    this.postsPerPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.postService.getPosts(this.currentPage, this.postsPerPage);
  }


  ngOnDestroy(){
    this.postSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
