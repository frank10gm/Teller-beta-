import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  postsSubject = new BehaviorSubject<any>({});
  posts$: Observable<any>;

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

  getPosts() {    
    const sendData = {
      action: 'getPosts',
      num: '0',
      order: 'added',
      order2: '20',
      lat: '40',
      lng: '11',
      user_id: 0
    };    

    this.http.post(environment.mainEndpoint, sendData, this.httpOptions)
    .pipe(
      tap(resp => {
        // console.log(resp);
      })
    ).subscribe(resp => {
      this.postsSubject.next(resp);
    });
  }
}
