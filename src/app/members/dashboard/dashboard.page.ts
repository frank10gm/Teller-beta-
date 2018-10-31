import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.api.getPosts();
  }

  logout() {
    this.authService.logout();
  }

}
