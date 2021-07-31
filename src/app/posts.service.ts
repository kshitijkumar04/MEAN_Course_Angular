import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient} from "@angular/common/http";
import {map} from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostsService{
 private post:Post[] = [];
 private postUpdated = new Subject<{posts: Post[], postCount:number}>();

 constructor (private http:HttpClient, private router: Router) {}

 getPosts(currentPage: number, postsPerPage:number){
     const query= `?pageSize=${postsPerPage}&page=${currentPage}`;
     this.http.get<{message:string, posts:any, totalPosts: number}>('http://localhost:3000/api/posts'+ query)
     .pipe(map((postdata) =>{
         return {post: postdata.posts.map( (post) =>{
             return {
                 title : post.title,
                 content :post.content,
                 id : post._id,
                 imagePath : post.imagePath
             }
         }), totalPosts: postdata.totalPosts}
     }))
     .subscribe((transformedPostsData) =>{
        this.post = transformedPostsData.post;
        this.postUpdated.next({posts: [...this.post], postCount: transformedPostsData.totalPosts});
     })
 }

 getPostUpdateListener(){
     return this.postUpdated.asObservable();
 }

 getPost(id:string){
     return this.http.get<{_id: string, title : string, content: string, imagePath: string}>(`http://localhost:3000/api/posts/${id}`);
 }


 updatePost(id:string, title: string, content: string, image : File | string){
    let postData;
    if(typeof(image) === 'object'){
     postData = new FormData();
     postData.append('id', id);
     postData.append("title", title);
     postData.append("content", content);
     postData.append("image", image, title);
    } else {
        postData ={
            id: id,
            title: title,
            content:content,
            imagePath: image
        }
    }
     this.http.put(`http://localhost:3000/api/posts/${id}`, postData).
     subscribe(res => {
         this.router.navigate(['/']);
     });
 }


 addPost(title:string, content: string, image : File){
     
     const postData = new FormData();
     postData.append("title", title);
     postData.append("content", content);
     postData.append("image", image, title);
     this.http.post<{message:string, post: Post}>('http://localhost:3000/api/posts',postData).
     subscribe((responseReceived) =>{
         console.log(responseReceived);
        this.router.navigate(['/']);
     })
    
 }

 deletePost(id : string){
     return this.http.delete(`http://localhost:3000/api/posts/${id}`);
 }
}