import { Component, NgZone, EventEmitter } from '@angular/core';

import { RoleService } from './role.service';

import {FORM_DIRECTIVES, CORE_DIRECTIVES, NgFor} from '@angular/common';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/components/dropdown';
import {
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS,
    Router
} from '@angular/router';

import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {AngularFire, FirebaseAuth} from 'angularfire2';
@Component(
    {
        selector: 'display',
        directives: [NgFor],
        providers: [RoleService],
        template: `
             <div class=" text-xs-center text-lg-center  text-md-center col-xs-12 col-sm-12  col-md-8 col-lg-offset-2 col-lg-8">
        <div class="card">
            <div class="card-header card-inverse card-info">
                3S Auto Customer Service - Register
            </div>
            <div class="card-block">
                <form class="form-inline">
                    <span class="radio">
                        <input class="form-control" required [(ngModel)]="dealername" placeholder="Dealer Name"><br>
                        <input class="form-control" required [(ngModel)]="fname" placeholder="First name"><input class="form-control" required [(ngModel)]="lname" placeholder="Last name"><br>
                        <input class="form-control" required [(ngModel)]="phone" placeholder="Phone"><input class="form-control" type="password" required #password placeholder="Password"><br>
                        <input class="form-control" required [(ngModel)]="email" placeholder="User email"><input class="form-control" required [(ngModel)]="address" placeholder="Address"><br>
                    </span><br>
                    <button class="btn btn-primary-outline btn-sm" [disabled]="!(fname && lname && phone )" (click)="signupStore(fname, lname,email,password.value,dealername,phone,address)">Signup</button>
                </form>
            </div>
            <div *ngIf="errmsg" class="card-header card-inverse card-warning">
                {{errmsg}}
            </div>
        </div>

    </div>

	`
    })
export class Signup {
    errmsg: string;

    fname: string;
    lname: string;
    email: string;
    phone: string;
    dealername: string;

    private parentRouter: Router;
    static uu: string;
    uid: string;
    constructor(public auth0: FirebaseAuth, _parentRouter: Router, public rs: RoleService, public af: AngularFire) {

        this.parentRouter = _parentRouter;
    }

    signupStore(fname: string, lname: string, email: string, password: string, dealername: string, phone: string, address: string) {
        if (!password || password === undefined) password = this.rs.clearPhone(phone);
        let loginemail = this.rs.genEmail(phone);

        this.af.auth.createUser({
            email: loginemail,
            password: password
        }).then(function (authdata) {
            Signup.uu = authdata.uid;
            localStorage.setItem('uid', authdata.uid);
        }).catch(function (error) {
            switch (error.code) {
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email.");
                    this.errmsg = "The specified phone is invalid.";
                    break;
                default:
                    this.errmsg = "Error creating user:" + error;
                    console.log("Error creating user:", error);
                    break;
                case "EMAIL_TAKEN":
                    this.errmsg = "The new user account cannot be created because the phone is already in use. Use the credential to setup store.";
                    console.log("The new user account cannot be created because the phone is already in use. Use the credential to setup store.");
                    break;
            }
            return;
        });

        setTimeout(() => {
            this.uid = localStorage.getItem('uid');
            localStorage.setItem('uid', "");
            this.af.auth.login({ email: loginemail, password: password }).then((authData) => {
                //this.uid = authData.uid;
                let forDealer: boolean = true;
                if (!dealername || dealername === undefined) forDealer = false;
                if (this.uid) {

                    if (forDealer) {
                        //console.log("44" + this.uid);
                        this.af.database.object("/users/" + this.uid).update({
                            uid: this.uid,
                            email: email,
                            fname: fname,
                            lname: lname,
                            phone: phone,
                            role: 4,
                            ownerid: this.uid,
                            dealername: dealername,
                            password: 'secret'
                        });

                        this.af.database.object("/dealers/" + this.uid).update({
                            dealername: dealername,
                            uid: this.uid
                        });
                    } else { //end user
                        //console.log("???11" + this.uid);
                        this.af.database.object("/users/" + this.uid).update({
                            uid: this.uid,
                            email: email,
                            fname: fname,
                            lname: lname,
                            phone: phone,
                            role: 1,
                            ownerid: "",
                            dealername: "",
                            password: 'secret'
                        });
                    }
                    this.parentRouter.navigateByUrl('/admin/Employees');

                }
            });
        }, 1500);
        setTimeout(() => {
            this.errmsg = "";
        }, 5000);
    }

}
