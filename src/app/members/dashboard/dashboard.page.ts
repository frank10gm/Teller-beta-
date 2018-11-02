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
  @ViewChild(VirtualScroll) VirtualScroll: VirtualScroll;
  public posts$: Observable<any[]>;
  private curPost: number = 0;  
  private lastPost: number = 0;
  private infiniteEvent: any;
  public posts: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private api: ApiService,
    private toast: ToastController,
    private audioService: AudioService
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
      this.posts = resp;       
      console.log('dev12', this.posts);             
    });

    this.api.getPosts({
      num: this.curPost
    });

    // window.setInterval(()=>{ this.posts = [...this.posts] },2000);

    // audio gest
    this.audioService.audioService.audio = new Audio();    
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

  playPost(post){            
    if(post.audioPlaying) {
      this.audioService.audio.pause();    
      post.audioPlaying = false;
    }else{
      this.audioService.audio.src = environment.mainEndpoint+'/uploads/audio/'+post.audio;
      this.audioService.audio.load();    

      this.audioService.audio.ontimeupdate = (e) => {
        this.handleTimeUpdate(post);
      }

      this.audioService.audio.onended = (e) => {
        post.audioPlaying = false;
        post.currentTime = 0;
        post.elapsed = 0;
      }

      this.audioService.audio.onerror = (e) => {        
        this.presentToast('There was an error with this audio file.')
        post.audioEnabled = false;
        post.audioPlaying = false;
      }

      if(post.elapsed) this.audioService.audio.currentTime = post.elapsed;
      if(post.elapsed >= post.duration){
        this.audioService.audio.currentTime = 0;
      }        
      post.audioEnabled = true;
      post.audioPlaying = true;      
      this.audioService.audio.play(); 
    }           
  }

  handleTimeUpdate(post) {
    const elapsed =  this.audioService.audio.currentTime;
    const duration = this.audioService.audio.duration;    
    post.position = elapsed / duration;
    post.elapsed = (elapsed);
    post.duration = (duration);
  }

  audioChange(e, post){        
    post.elapsed = e.detail.value;    
  }

  playFrom(post){    
    // this.playPost(post);
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000      
    });
    toast.present();
  }

}
