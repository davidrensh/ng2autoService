import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
//import { Subject } from 'rxjs/Subject';
import {LocationStrategy, HashLocationStrategy, Location} from '@angular/common';

import { RoleService } from './role.service';
import {
  ROUTER_DIRECTIVES,
  ROUTER_PROVIDERS,
  Router, Routes
} from '@angular/router';
/*
 * Components
 */
// import {AdminComponent} from './admin.component';

import {MemberHome} from './MemberHome';

import {Login} from './Login';
import {Signup} from './Signup';
import {About} from './About';


@Component({
  //moduleId: module.id,
  selector: 's4-app',
  directives: [ROUTER_DIRECTIVES],
  // providers :[RoleService],

  templateUrl: 'app/s4.component.html',
  styleUrls: ['app/s4.component.css']
})
@Routes([
  { path: '/home', component: Login },
  { path: '/Login', component: Login },
  { path: '/MemberHome', component: MemberHome },
  { path: '/Signup', component: Signup },
  { path: '/About', component: About }
])
export class S4AppComponent {
  //isLoggedIn: boolean = false;
  // title = 's4 works!';
  //items: FirebaseListObservable<any[]>;
  //  subfilter: Subject <any>;
  constructor(public router: Router, public rs: RoleService, public loc: Location) {
    this.logout();
  }
  logout() {
    //localStorage.removeItem('jwt');

    // Login.messagesRef.unauth();
    //console.log("Location" + location);
    this.rs.role = 0;
    if (location.pathname === "/admin")
      this.router.navigateByUrl('/admin/AdminLogin');
    else this.router.navigateByUrl('/home/Login');
  }
}
