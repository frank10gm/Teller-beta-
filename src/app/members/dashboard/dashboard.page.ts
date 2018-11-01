import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { InfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  public posts$: Observable<any[]>;
  private curPost: number = 0;  
  private lastPost: number = 0;
  private infiniteEvent: any;
  public posts: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private api: ApiService
  ) { }

  ngOnInit() {    
    this.posts$ = this.api.posts$;
    this.posts$.pipe(
      tap(resp =>{        
        if(this.infiniteEvent) this.infiniteEvent.complete();     

        this.curPost += 20;        

        if(this.lastPost === resp.length){
          if(this.infiniteEvent) this.infiniteEvent.disabled = true;
        }else{
          this.lastPost = resp.length;
        }                
      })
    ).subscribe(resp => {      
      console.log('dev12', resp);
      // this.posts.push(...resp)
      // this.posts = [...this.posts, ...resp];
      console.log('dev13', this.posts);
    });

    this.api.getPosts({
      num: this.curPost
    });
  }

  infiniteLoad(event){        
    this.api.getPosts({
      num: this.curPost
    })    
    this.infiniteEvent = event.target;
  }

  doRefresh(event){
    event.target.complete();
  }

}
