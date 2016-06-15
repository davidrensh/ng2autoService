import { Component, NgZone, Directive, Attribute, ElementRef, DynamicComponentLoader, Pipe, PipeTransform } from '@angular/core';

import { RoleService } from './role.service';

import {FORM_DIRECTIVES, CORE_DIRECTIVES, DatePipe, NgIf, NgFor} from '@angular/common';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/components/dropdown';
import {
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS,
    Router
} from '@angular/router';

import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import {AngularFire, FirebaseAuth, FirebaseListObservable} from 'angularfire2';



import {DATEPICKER_DIRECTIVES} from 'ng2-bootstrap/components/datepicker';
import {TimepickerComponent} from 'ng2-bootstrap/components/timepicker';
import {TAB_DIRECTIVES} from 'ng2-bootstrap/components/tabs';

import {GoogleMapDirective} from './google-map.directive';
import {GoogleMapMarkerDirective} from './google-map-marker.directive';
// Services.
import {MapsService} from './maps.service';
import {GeolocationService} from './geolocation.service';
import {GeocodingService} from './geocoding.service';

@Component({
    selector: 'owner',
    //providers :[RoleService],
    directives: [TAB_DIRECTIVES,ROUTER_DIRECTIVES, TimepickerComponent, DATEPICKER_DIRECTIVES],
    template: `
            <div class="text-xs-center text-lg-center  text-md-center col-xs-12 col-sm-12  col-md-8 col-lg-offset-2 col-lg-8">
            <div class="card">
                <div class="card-header card-inverse card-info">
                    {{selecteddealer}} &nbsp; 3S Auto Customer Service - Setup Drivers
                </div>
                <div class="card-block">
                   <tabset>
                        <tab *ngFor="let d of Drivers | async"
                            [heading]="d.fname + ' ' + d.lname" [active]="true" 
                            (select)="selectDriver(d)"
                            >
                        </tab>
                        <tab  class="pull-right" heading="New" (select)="driverfname = ''; driverlname = ''; driverphone =''; driverpassword=''"></tab>
                   </tabset>
 
                    <form class="form-inline">
                        <span class="radio">
                            <input class="form-control" required [(ngModel)]="driverfname" placeholder="Driver first name">
                            <input class="form-control" required [(ngModel)]="driverlname" placeholder="Driver last name"><br>
                            <input class="form-control" required [(ngModel)]="driverphone" placeholder="Driver phone number">
                            <input class="form-control" type="password" required [(ngModel)]="driverpassword" placeholder="Password"><br>
                            <input  [hidden]="true" class="form-control" [(ngModel)]="driveraddress" placeholder="Driver address"><br>
                        </span><br>
                        <button class="btn btn-primary-outline btn-sm" [disabled]="!(driverfname && driverlname && driverphone)" (click)="SaveDriver(driverfname , driverlname , driverphone,driverpassword,driveraddress)">Save</button>
                        <button class="btn btn-primary-outline btn-sm" [disabled]="!selectedDriver || !driverphone" [hidden]="suredeleteDriver" (click)="suredeleteDriver = true">Delete</button>
                    </form>
                    
                    <button class="btn btn-primary-outline btn-sm" [hidden]="!selectedDriver || !suredeleteDriver" (click)="deleteDriver()" style="color:Crimson">Delete {{driverfname}} {{driverlname}}? Yes</button>
                    <button class="btn btn-primary-outline btn-sm" [hidden]="!selectedDriver || !suredeleteDriver" (click)="suredeleteDriver = false" style="color:DarkGreen">Cancel</button>
                </div>
                <div *ngIf="driverErrMsg" class="card-footer card-inverse card-warning">
                    {{driverErrMsg}}
                </div>
            </div>
            </div>


  `
})

export class Drivers {
    employeeErrMsg: string = "";
    static s_uid: string = "";
    static s_err: string = "";
    driverErrMsg: string = "";
    Drivers: FirebaseListObservable<any[]>;
    Employees: FirebaseListObservable<any[]>;
    RptDates: FirebaseListObservable<any[]>;
    RptDetails: FirebaseListObservable<any[]>;

    selectedDriver: string;
    suredeleteDriver: boolean = false;
    selectedEmployee: string;
    suredeleteEmployee: boolean = false;


    errmsg: string;
    selecteddealer: string;
    isLoggedIn: boolean = false;
    driverfname: string;
    driverlname: string;
    driveraddress: string;
    driverphone: string;
    driverpassword: string;

    employeepassword: string;
    employeefname: string;
    employeelname: string;
    employeeaddress: string;
    employeephone: string;

    uid: string;
    ownerid: string;
    email: string;
    phone: string;
    password: string;
    private parentRouter: Router;

    static s_driver: any;
    static s_employee: any;

    constructor(_parentRouter: Router, public af: AngularFire, public rs: RoleService) {
        this.parentRouter = _parentRouter;

        this.selecteddealer = this.rs.dealer;
        this.uid = this.rs.uid;
        this.ownerid = this.rs.ownerId;
        this.phone = this.rs.phone;
        if (!this.ownerid || !this.selecteddealer) {
            this.parentRouter.navigateByUrl('/admin/AdminLogin');
        }
        this.loadDriver();
        //this.af.database.object("/dealers/" + this.selecteddealer).subscribe(res => {
        //    this.ownerid = res.uid;
        //}
        //);
        //this.RptDates = this.af.list("/users/" + this.ownerid + "/shuttles");
    }

    SaveDriver(driverfname: string, driverlname: string, driverphone: string, password: string, driveraddress: string) {//storename: string, renewYears: number, maxPurchase: number, maxRedeem: number) {
        var e = this.rs.genEmail(driverphone);
        if (!password || password === undefined) password = this.rs.clearPhone(driverphone);
        Drivers.s_uid = "";//localStorage.setItem('uid', "");
        this.af.auth.createUser({
            email: e,
            password: password
        }).then(function (authdata) {
            Drivers.s_uid = authdata.uid;
            //localStorage.setItem('uid', authdata.uid);
        }).catch(function (error) {
            switch (error.code) {
                case "INVALID_EMAIL":
                    Drivers.s_err = "The specified phone is invalid.";
                    break;
                default:
                    Drivers.s_err = "Error creating user:" + error;
                    break;
                case "EMAIL_TAKEN":
                    Drivers.s_err = "The new user account cannot be created because the phone is already in use. Use the credential to setup driver.";
                    break;
            }
            //console.log("this.driverErrMsg=" + this.driverErrMsg)
            return;
        });
        setTimeout(() => {
            this.driverErrMsg = "";
        }, 10000);
        setTimeout(() => {
            this.driverErrMsg = Drivers.s_err;
            let uid = Drivers.s_uid;//localStorage.getItem('uid');
            if (uid != "") {
                this.driverErrMsg = "";
                this.af.database.object("/users/" + this.ownerid + "/drivers/" + uid).update({
                    uid: uid,
                    email: "",
                    fname: driverfname,
                    lname: driverlname,
                    phone: driverphone,
                    address: ""
                });


                this.af.object("/users/" + uid).update({
                    uid: uid,
                    email: "",
                    fname: driverfname,
                    lname: driverlname,
                    phone: driverphone,
                    role: 2,
                    ownerid: this.ownerid,
                    dealername: this.selecteddealer,
                    password: 'secret',
                    address: ""
                });
            }
        }, 1000);
        return true;
    }
    selectDriver(d: any) {
        this.selectedDriver = d.uid;
        this.driverfname = d.fname;
        this.driverlname = d.lname;
        this.driveraddress = d.address;
        this.driverphone = d.phone;
        //console.log("aaa" + d.uid + d.driverfname);
    }
    deleteDriver() {
        this.af.object("/users/" + this.selectedDriver).remove();
        this.af.object("/users/" + this.ownerid + "/drivers/" + this.selectedDriver).remove();

        this.suredeleteDriver = false;
        this.loadDriver();
    }
    clearAll() {
        this.Drivers = null;
        Drivers.s_driver = null;
        this.selectedDriver = "";
        this.driverfname = "";
        this.driverlname = "";
        this.driveraddress = "";
        this.driverphone = "";
        Drivers.s_err = "";
    }
    loadDriver() {
        this.clearAll();
        this.Drivers = this.af.database.list('/users/' + this.ownerid + '/drivers');
        let o = this.af.database.list('/users/' + this.ownerid + '/drivers', {
            query: {
                limitToFirst: 1
            }
        });
        //this.selectDriver(o);
        o.subscribe(res => {
            if (res) {
                res.map(function (item) {
                    Drivers.s_driver = item;
                });
            }
        }
        );
        setTimeout(() => {
            // console.log("sname:" + sname);

            if (Drivers.s_driver) {
                this.selectDriver(Drivers.s_driver);
            }
        }, 1000);
    }


}
