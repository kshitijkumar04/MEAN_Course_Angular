import { Component, OnInit, } from '@angular/core';
// import {Post} from '../post.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  constructor(public PostService:PostsService, public route:ActivatedRoute) { }

  //PostTitle = '';
  //PostContent = '';
  private mode: string = 'new';
  private postId: string;
  public post:Post;
  imagePreview: string;
  isLoading = false;
  form:FormGroup;

  onButtonClick(){
    if(this.form.invalid){
      return;
    }
    //const posts:Post = { title : form.value.title, content : form.value.content};
    if(this.mode === 'new'){
      this.PostService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    }
    else {
      this.PostService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
  }

  imagePicked(event : Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result as string);
    }
    reader.readAsDataURL(file);
  } 

  ngOnInit(): void {
    this.form = new FormGroup({
      'title' : new FormControl(null, {validators : [Validators.required, Validators.minLength(5)]}),
      'content' : new FormControl(null, {validators : [Validators.required] }),
      'image' : new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    })
    this.route.paramMap.subscribe((parammap:ParamMap)=>{
      if (parammap.has('postId')){
        this.isLoading = true;
        this.mode = 'edit';
        this.postId = parammap.get('postId');
        this.PostService.getPost(this.postId).subscribe(reqPost => {
          this.isLoading = false;
          this.post = {id: reqPost._id, title : reqPost.title, content : reqPost.content, imagePath:reqPost.imagePath };
          this.form.setValue({
            'title' : this.post.title,
            'content' : this.post.content,
            'image' : this.post.imagePath
          })
        });
      }
      else {
        this.mode = 'new';
        this.postId= null;
      }
    })

  }

}
