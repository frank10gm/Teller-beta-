import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public posts$: Observable<any>;

  constructor(
    private authService: AuthenticationService,
    private api: ApiService
  ) { }

  ngOnInit() {    
    this.posts$ = this.api.posts$;
    this.posts$.pipe(
      //
    ).subscribe(resp => {
      console.log('dev12', resp);
    });

    this.api.getPosts();
  }

  logout() {
    this.authService.logout();
  }

}
