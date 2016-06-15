
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
    //  providers :[RoleService],

    template: `
        <div class="vertical-center">
            <div class="container">
                <div class="span12  centered-text  text-xs-center text-lg-center  text-md-center col-xs-12 col-sm-12  col-md-8 col-lg-offset-4 col-lg-4">
                    <div class="card ">
                        <div class="card-header card-inverse card-info">
                            3S Auto Customer Service
                        </div>

                        <div class="card-block">
                            <input class="form-control" required [(ngModel)]="phone" placeholder="Phone number" (keyup.enter)="doneTypingPhone($event,phone,pass)"><br>
                            <input class="form-control" #pass type="password" required [(ngModel)]="password" placeholder="Last name" (keyup.enter)="btngo.focus()"><br>
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
export class Login {
    errmsg: string;

    role: number;

    authData: any;
    phone: string;

    password: string;

    constructor(public router: Router, private zone: NgZone, public rs: RoleService, public af: AngularFire, public loc: Location) {

    }

    authWithPassword(phone: string, password: string) {
        this.errmsg = "";
        if (!password || password === undefined) password = this.rs.clearPhone(phone);
        this.af.auth.login({ email: this.rs.genEmail(phone), password: this.password.trim().toLowerCase() }).then((authData) => {

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
                // switch (role) {
                //     case 1:
                if (this.loc.path().indexOf("/Login") > -1)
                    this.router.navigate(['/home/MemberHome']);
                //         break;
                //     case 2:
                //         this.router.navigate(['/DriverHome']);
                //         break;
                //     case 3:
                //         this.router.navigate(['/EmployeeHome']);
                //         break;
                //     case 4:
                //         this.router.navigate(['/Employees']);
                //         break;
                //     default:
                //         console.log("WTF, should not have this role at all.");
                // }
            }
            );

        }).catch((error) => {
            this.errmsg = error;
            console.log(error);
        });

        setTimeout(() => {
            this.errmsg = "";
        }, 5000);
    }

    doneTypingPhone($event, phone: string, passctl) {
        this.errmsg = "";
        passctl.focus();
        passctl.select();
    }
}
