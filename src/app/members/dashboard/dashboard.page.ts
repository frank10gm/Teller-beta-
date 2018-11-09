import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { InfiniteScroll, VirtualScroll, ToastController  } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { AudioService } from '../../services/audioService.service';

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
    private api: ApiService,    
    private audioService: AudioService
  ) { }

  ngOnInit() {    
    // get posts
    this.posts$ = this.api.posts$;
    this.posts$.pipe(
      tap(resp =>{        
        if(this.infiniteEvent) this.infiniteEvent.complete();             
        this.curPost = resp.length;             
        if(this.lastPost === resp.length){
          if(this.infiniteEvent) this.infiniteEvent.disabled = true;
        }else{
          this.lastPost = resp.length;
        }                
      })
    ).subscribe(resp => {            
      this.posts = resp;           
    });

    this.api.getPosts({
      num: 0
    });
    this.audioService.audio = new Audio();    
  }

  infiniteLoad(event){          
    this.api.getPosts({
      num: this.curPost
    })    
    this.infiniteEvent = event.target;
  }

  doRefresh(event){
    this.curPost = 0;
    this.lastPost = 0;

    this.api.getPosts({
      num: this.curPost
    }, true);

    this.infiniteEvent = event.target;    
  }

  openMessages(){
    //    
  }

  identify(index, post){
    console.log('dev11', index, post);
    return post.id;
  }

}
