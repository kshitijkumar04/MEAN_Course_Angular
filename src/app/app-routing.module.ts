import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {path:'', component:PostListComponent},
  {path: 'create', component:PostCreateComponent},
  {path: 'edit/:postId', component:PostCreateComponent},
  {path: 'login', component:LoginComponent},
  {path: 'signup', component:SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
