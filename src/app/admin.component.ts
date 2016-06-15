import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
//import { Subject } from 'rxjs/Subject';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import { RoleService } from './role.service';
import {
  ROUTER_DIRECTIVES,
  ROUTER_PROVIDERS,
  Router, Routes
} from '@angular/router';
/*
 * Components
 */
import {EmployeeHome} from './EmployeeHome';
import {BookingComponent} from './Booking.Component';
import {DriverHome} from './DriverHome';
import {MemberHome} from './MemberHome';

import {Drivers} from './Drivers';
import {Employees} from './Employees';
import {Report} from './Report';

import {AdminLogin} from './AdminLogin';

import {About} from './About';


import {Signup} from './Signup';


@Component({
  //moduleId: module.id,
          // providers :[RoleService],
  directives: [ROUTER_DIRECTIVES],
  selector: 'app-admin',
  templateUrl: 'app/admin.component.html',
  styleUrls: ['app/admin.component.css']
})
@Routes([
  { path: '/', component: AdminLogin },
  { path: '/admin', component: AdminLogin },
  { path: '#/admin', component: AdminLogin },
  { path: '/Signup', component: Signup },
  { path: '/AdminLogin', component: AdminLogin },
  { path: '/MemberHome', component: MemberHome },

  { path: '/DriverHome', component: DriverHome },
  { path: '/EmployeeHome', component: EmployeeHome },
  { path: '/Booking', component: BookingComponent },
  { path: '/Report', component: Report },
  { path: '/Drivers', component: Drivers },
  { path: '/Employees', component: Employees },

  { path: '/About', component: About }
])
export class AdminComponent {
  //isLoggedIn: boolean = false;
  // title = 's4 works!';
  //items: FirebaseListObservable<any[]>;
  //  subfilter: Subject <any>;
  constructor(public router: Router, public rs: RoleService) {
    this.logout();
  }

  logout() {
    //localStorage.removeItem('jwt');

    // Login.messagesRef.unauth();
    this.rs.role = 0;
    this.router.navigateByUrl('/admin/AdminLogin');
  }
}
