
import { Component, NgZone, EventEmitter } from '@angular/core';

import { RoleService } from './role.service';

import {FORM_DIRECTIVES, CORE_DIRECTIVES, NgFor, Location} from '@angular/common';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/components/dropdown';
import {
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS,
    Router
} from '@angular/router';

import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {AngularFire, FirebaseAuth} from 'angularfire2';
@Component({
    selector: 'display',
    //providers: [RoleService],
    template: `
        <div class="vertical-center">
            <div class="container">
                <div class="span12  centered-text  text-xs-center text-lg-center  text-md-center col-xs-12 col-sm-12  col-md-8 col-lg-offset-4 col-lg-4">
                    <div class="card ">
                        <div class="card-header card-inverse card-info">
                            3S Auto Customer Service Admin
                        </div>

                        <div class="card-block">
                            <input class="form-control" required [(ngModel)]="phone" placeholder="Phone number" (keyup.enter)="doneTypingPhone($event,phone,pass)"><br>
                            <input class="form-control" #pass type="password" required [(ngModel)]="password" placeholder="Password" (keyup.enter)="btngo.focus()"><br>
                            <button class="btn btn-primary-outline btn-sm" #btngo [disabled]="!(phone && password)" (click)="authWithPassword(phone,password)">Sign in</button>
                        </div>
                        <div *ngIf="errmsg" class="card-footer card-inverse card-warning">
                            {{errmsg}}
                        </div>
                    </div>

                </div>
            </div>
        </div>

	`,
    directives: [NgFor, ACCORDION_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES],
})
export class AdminLogin {
    errmsg: string;

    role: number;

    authData: any;
    phone: string;

    password: string;

    constructor(public router: Router, private zone: NgZone, public rs: RoleService, public af: AngularFire, public loc: Location) {

    }

    authWithPassword(phone: string, password: string) {
        this.errmsg = "";
        //console.log("Rs1:" + this.rs.getTodayId());
        this.af.auth.login({ email: this.rs.genEmail(phone), password: this.password }).then((authData) => {
            //console.log("Rs2:" + authData.uid);
            this.authData = authData;
            //localStorage.setItem('uid', authData.uid);
            this.rs.uid = authData.uid;
            var usersRef = this.af.object("/users/" + this.authData.uid);
            usersRef.update({
                lastlogin: (new Date()).toISOString()
            });

            usersRef.subscribe(res => {
                let role = res.role;
                this.rs.dealer = res.dealername;
                this.rs.role = res.role;
                this.rs.uid = res.uid;
                this.rs.ownerId = res.ownerid;
                this.rs.phone = res.phone;
                this.rs.fname = res.fname;
                this.rs.lname = res.lname;
                //console.log("role:" + role + " getRole:" + this.rs.role);

            }
            );

        }).catch((error) => {
            this.errmsg = error;
            console.log(error);
        });
        setTimeout(() => {
            //console.log("path" + this.loc.path());
            if (this.loc.path().indexOf("AdminLogin") > -1 || this.loc.path().indexOf("/admin") > -1)
                switch (this.rs.role) {
                    case 1:
                        this.router.navigate(['/admin/MemberHome']);
                        break;
                    case 2:
                        this.router.navigate(['/admin/DriverHome']);
                        break;
                    case 3:
                        this.router.navigate(['/admin/EmployeeHome']);
                        break;
                    case 4:
                        this.router.navigate(['/admin/Employees']);
                        break;
                    default:
                        console.log("WTF, should not have this role at all.");
                }
        }, 1000);
        setTimeout(() => {
            this.errmsg = "";
        }, 5000);
        return true;
    }

    doneTypingPhone($event, phone: string, passctl) {
        this.errmsg = "";
        passctl.focus();
        passctl.select();
    }
}
