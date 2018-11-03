import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();      
      this.authenticationService.authenticationState.subscribe(state => {         
        if (state === 1) {          
          this.router.navigate(['members', 'tabs']);
        }else if(state === 2){
          this.router.navigate(['members', 'tabs']);
          // this.router.navigate(['login']);
        }else{
          this.router.navigate(['splash']);
        }
      });
      
    });
  }
}
