import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map } from 'rxjs/operators';
import { send } from 'q';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  postsSubject = new BehaviorSubject<any[]>([]);
  posts$: Observable<any[]>;
  isLoading = new BehaviorSubject<boolean>(false);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(
    private http: HttpClient,
    private toast: ToastController
  ) {
    this.posts$ = this.postsSubject;
  }

  // get all the posts
  getPosts(data: any, reset: boolean = false) {    
    const sendData = {
      action: 'getPosts',      
      order: 'added',
      order2: '20',
      lat: '40',
      lng: '11',
      user_id: 0,
      ...data
    };    
    
    this.isLoading.next(true);

    return this.http.post<any[]>(environment.mainEndpoint, sendData, this.httpOptions)
    .pipe(
      tap(resp => {
        this.isLoading.next(false);      
      })
    )
    .subscribe(resp => {
      if(reset) this.postsSubject.next([...resp]);      
      else this.postsSubject.next([...this.postsSubject.getValue(), ...resp]);
    });
  }

  // present toast messages
  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000      
    });
    toast.present();
  }

  // get searched posts
  searchPosts(data: any, reset: boolean = false) {    
    const sendData = {
      api: 'TELLER',
      action: 'searchPosts',
      data: {            
        order2: '20',
        lat: '40',
        lng: '11',
        user_id: 0,
        ...data
      }      
    };    
    
    this.isLoading.next(true);

    return this.http.post<any[]>(environment.mainEndpoint+'?v=3', sendData, this.httpOptions)
    .pipe(
      tap(resp => {
        this.isLoading.next(false);        
      })
    )
  }

}
