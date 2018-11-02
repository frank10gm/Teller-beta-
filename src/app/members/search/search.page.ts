import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { InfiniteScroll } from '@ionic/angular';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AudioService } from '../../services/audioService.service';
import { tap, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;  
  public posts$: Observable<any[]>;
  public postsSubject = new BehaviorSubject<any[]>([]);
  private curPost: number = 0;  
  private lastPost: number = 0;
  private infiniteEvent: any;
  public posts: any[] = [];
  private searchTerm = new BehaviorSubject<string>('');  

  constructor(
    private api: ApiService,
    private audioService: AudioService
  ) { }

  ngOnInit() {              

    this.audioService.audio = new Audio();    

    this.posts$ = this.postsSubject;
    
    this.searchTerm.pipe(      
      debounceTime(300),
      distinctUntilChanged(),
      tap(term => {
        // console.log('dev10n', term)
      }),      
      switchMap((term: string) => {
        if(term === '') return of([]);
        else return this.api.searchPosts({
          num: 0,
          searchTerm: term,
          order: 'added'
        }).pipe(
          catchError((e) => {
            console.log('error', e);
            return of([]);
          })
        )
      })
    ).subscribe(resp => {            
      this.postsSubject.next(resp);
    });     

    this.posts$.subscribe(resp => {          
      if(!resp) return;
      if(this.infiniteEvent) this.infiniteEvent.complete();     
      this.curPost = resp.length;        
      if(this.lastPost === resp.length){
        if(this.infiniteEvent) this.infiniteEvent.disabled = true;
      }else{
        this.lastPost = resp.length;
      } 
    })
        
  }

  infiniteLoad(event){            
    this.api.searchPosts({
      num: this.curPost,
      searchTerm: this.searchTerm.getValue(),
      order: 'added'
    }).pipe(
      catchError((e) => {
        console.log('error', e);
        return of([]);
      })     
    ).subscribe(resp => {      
      this.postsSubject.next([...this.postsSubject.getValue(), ...resp]);
    });
    
    this.infiniteEvent = event.target;
  }

  onSearch(event){
    this.searchTerm.next(event.detail.value);
  }

}
