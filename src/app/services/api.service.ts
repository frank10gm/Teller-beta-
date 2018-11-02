import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map } from 'rxjs/operators';
import { send } from 'q';

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

  constructor(private http: HttpClient) {
    //
    this.posts$ = this.postsSubject;
  }

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
        // console.log('dev13 isLoading')
      })
    )
    .subscribe(resp => {
      if(reset) this.postsSubject.next([...resp]);      
      else this.postsSubject.next([...this.postsSubject.getValue(), ...resp]);
    });
  }
}
