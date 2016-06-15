import { Component } from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';


import {
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS,
    Router, Routes
} from '@angular/router';

import {AdminComponent} from './admin.component';

import {S4AppComponent} from './s4.component';
import {Login} from './Login';

import {About} from './About';
import {MemberHome} from './MemberHome';

import {EmployeeHome} from './EmployeeHome';
import {BookingComponent} from './Booking.Component';

import {DriverHome} from './DriverHome';

import {Drivers} from './Drivers';
import {Employees} from './Employees';
import {Report} from './Report';

import {AdminLogin} from './AdminLogin';

import { RoleService } from './role.service';
import {Signup} from './Signup';
@Component({
    selector: 'app-main',
    directives: [ROUTER_DIRECTIVES],

    templateUrl: 'app/main.component.html'
})
@Routes([

    { path: '/admin', component: AdminComponent },
    { path: '/Admin', component: AdminComponent },
    { path: '/#/admin', component: AdminComponent },
    { path: '/', component: S4AppComponent },
    { path: '/home', component: S4AppComponent },

    { path: '/home/Login', component: Login },
    { path: '/home/MemberHome', component: MemberHome },
    { path: '/home/About', component: About },

    { path: '/admin/AdminLogin', component: AdminLogin },
    { path: '/admin/Signup', component: Signup },

    { path: '/admin/EmployeeHome', component: EmployeeHome },
    { path: '/admin/Booking', component: BookingComponent },
    { path: '/admin/Report', component: Report },
    { path: '/admin/Drivers', component: Drivers },
    { path: '/admin/Employees', component: Employees },
    { path: '/admin/DriverHome', component: DriverHome },
    { path: '/admin/About', component: About }

])
export class MainComponent {
    constructor(public router: Router, public rs: RoleService) {
        //console.log("main:" + location.pathname);
        if (location.pathname === "/admin")
            this.router.navigateByUrl('/admin/AdminLogin');
        else if (location.pathname === "/home") this.router.navigateByUrl('/home/Login');
        this.router.navigateByUrl('/home/Login');
    }

}
