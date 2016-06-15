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
    directives: [TAB_DIRECTIVES, ROUTER_DIRECTIVES, TimepickerComponent, DATEPICKER_DIRECTIVES],
    template: `

            <div class=" text-xs-center text-lg-center  text-md-center col-xs-12 col-sm-12  col-md-8 col-lg-offset-2 col-lg-8">
            <div class="card ">
                <div class="card-header card-inverse card-info">
                    {{selecteddealer}} &nbsp; 3S Auto Customer Service - Setup Employee
                </div>
                <div class="card-block">
                    <tabset>
                        <tab *ngFor="let d of Employees | async"
                            [heading]="d.fname + ' ' + d.lname" [active]="true" 
                            (select)="selectEmployee(d)"
                            >
                        </tab>
                        <tab  class="pull-right" heading="New" (select)="employeefname = ''; employeelname = ''; employeephone =''; employeepassword=''"></tab>
                    </tabset>
                    <form class="form-inline">
                        <span class="radio">
                            <input class="form-control" required [(ngModel)]="employeefname" placeholder="Employee first name">
                            <input class="form-control" required [(ngModel)]="employeelname" placeholder="Employee last name"><br>
                            <input class="form-control" required [(ngModel)]="employeephone" placeholder="Employee phone number">
                            <input class="form-control" type="password" required [(ngModel)]="employeepassword" placeholder="Password"><br>
                            <input [hidden]="true" class="form-control" [(ngModel)]="employeeaddress" placeholder="Employee address"><br>
                        </span><br>
                        <button class="btn btn-primary-outline btn-sm" [disabled]="!(employeefname && employeelname && employeephone)" (click)="SaveEmployee(employeefname , employeelname , employeephone,employeepassword, employeeaddress)">Save</button>
                        <button class="btn btn-primary-outline btn-sm" [disabled]="!selectedEmployee || !employeephone " [hidden]="suredeleteEmployee" (click)="suredeleteEmployee = true">Delete</button>
                    </form>
                    
                    <button class="btn btn-primary-outline btn-sm" [hidden]="!selectedEmployee || !suredeleteEmployee" (click)="deleteEmployee()" style="color:Crimson">Delete {{employeefname}} {{employeelname}}? Yes</button>
                    <button class="btn btn-primary-outline btn-sm" [hidden]="!selectedEmployee || !suredeleteEmployee" (click)="suredeleteEmployee = false" style="color:DarkGreen">Cancel</button>
                </div>
  
                <div *ngIf="employeeErrMsg" class="card-footer card-inverse card-warning">
                    {{employeeErrMsg}}
                </div>
            </div>
            </div>



  `
})

export class Employees {
    static s_err: string = "";
    static s_uid: string = "";
    employeeErrMsg: string = "";
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
        this.loadEmployee();
    }
    clearAll() {
        this.Employees = null;
        Employees.s_employee = null;
        this.selectedEmployee = "";
        this.employeefname = "";
        this.employeelname = "";
        this.employeeaddress = "";
        this.employeephone = "";
        Employees.s_err = "";
    }
    loadEmployee() {
        this.clearAll();
        this.Employees = this.af.list("/users/" + this.ownerid + "/employees");
        let o = this.af.database.list('/users/' + this.ownerid + '/employees', {
            query: {
                limitToFirst: 1
            }
        });

        o.subscribe(res => {
            if (res) {
                res.map(function (item) {
                    Employees.s_employee = item;
                });
            }
        }
        );
        setTimeout(() => {
            if (Employees.s_employee) {
                this.selectEmployee(Employees.s_employee);
            }
        }, 1000);
    }
    SaveEmployee(employeefname: string, employeelname: string, employeephone: string, password: string, employeeaddress: string) {//storename: string, renewYears: number, maxPurchase: number, maxRedeem: number) {
        var e = this.rs.genEmail(employeephone);
        if (!password || password === undefined) password = this.rs.clearPhone(employeephone);
        Employees.s_uid = ""; //localStorage.setItem('uid', "");
        Employees.s_err = "";
        this.af.auth.createUser({
            email: e,
            password: password
        }).then(function (authdata) {
            Employees.s_uid = authdata.uid;// localStorage.setItem('uid', authdata.uid;//);
        }).catch(function (error) {
            switch (error.code) {
                case "INVALID_EMAIL":
                    Employees.s_err = "The specified phone is invalid.";
                    break;
                default:
                    Employees.s_err = "Error creating user:" + error;
                    break;
                case "EMAIL_TAKEN":
                    Employees.s_err = "The new user account cannot be created because the phone is already in use. Use the credential to setup driver.";
                    break;
            }
            return;
        });

        setTimeout(() => {
            this.employeeErrMsg = Employees.s_err;
            let uid = Employees.s_uid;// localStorage.getItem('uid');
            if (uid != "") {
                this.employeeErrMsg = "";
                //console.log("uid:" + uid + employeefname + employeelname + employeephone+ employeeaddress)
                this.af.database.object("/users/" + this.ownerid + "/employees/" + uid).update({
                    uid: uid,
                    email: "",
                    fname: employeefname,
                    lname: employeelname,
                    phone: employeephone,
                    address: ""
                });

                this.af.object("/users/" + uid).update({
                    uid: uid,
                    email: "",
                    fname: employeefname,
                    lname: employeelname,
                    phone: employeephone,
                    role: 3,
                    ownerid: this.ownerid,
                    dealername: this.selecteddealer,
                    password: 'secret',
                    address: ""
                });
            }

        }, 1300);
        setTimeout(() => {
            this.employeeErrMsg = "";
        }, 18000);
    }
    selectEmployee(d: any) {
        this.selectedEmployee = d.uid;
        this.employeefname = d.fname;
        this.employeelname = d.lname;
        this.employeeaddress = d.address;
        this.employeephone = d.phone;
        // console.log("aaa" + d.uid + d.employeefname);
    }
    deleteEmployee() {
        this.af.object("/users/" + this.selectedEmployee).remove();
        this.af.object("/users/" + this.ownerid + "/employees/" + this.selectedEmployee).remove();

        this.suredeleteEmployee = false;
        //this.loadStore();
    }

}
