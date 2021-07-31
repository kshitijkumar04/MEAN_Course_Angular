import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private authService:AuthService) { }
  private authListenerSubs:Subscription;
  public userAuthenticated= false

  ngOnInit(): void {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(result=>{
      this.userAuthenticated = result;
    });
  }

  logout(){
    this.authService.logout();
  }

  ngOnDestroy(){

    this.authListenerSubs.unsubscribe();

  }

}
