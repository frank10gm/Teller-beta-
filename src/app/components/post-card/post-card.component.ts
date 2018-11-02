import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AudioService } from '../../services/audioService.service';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'hw-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  @Input() post: any;
  
  constructor(
    private toast: ToastController,
    private audioService: AudioService,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  playPost(post){
    if(post.audioPlaying) {
      this.audioService.audio.pause();    
      post.audioPlaying = false;
    }else{
      if(this.audioService.audio.src != environment.mainEndpoint+'/uploads/audio/'+post.audio){
        this.audioService.audio.src = environment.mainEndpoint+'/uploads/audio/'+post.audio; //'0aa1883c6411f7873cb83dacb17b0afc.m4a';
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
          this.api.presentToast('There was an error with this audio file.')
          post.audioEnabled = false;
          post.audioPlaying = false;
        }

        this.audioService.audio.onloadeddata = (e) => {
          if(post.elapsed) this.audioService.audio.currentTime = post.elapsed;          
        }
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

}
