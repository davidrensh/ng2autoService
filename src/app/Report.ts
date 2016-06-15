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
import {GoogleMapDirective} from './google-map.directive';
import {GoogleMapMarkerDirective} from './google-map-marker.directive';
// Services.
import {MapsService} from './maps.service';
import {GeolocationService} from './geolocation.service';
import {GeocodingService} from './geocoding.service';
//import {DataTableDirectives} from 'angular2-datatable/datatable';

@Component({
    // providers :[RoleService],
    selector: 'owner',
    directives: [ROUTER_DIRECTIVES, TimepickerComponent, DATEPICKER_DIRECTIVES],
    template: `
            <div class=" text-xs-center text-lg-center  text-md-center col-xs-12 col-sm-12  col-md-8 col-lg-offset-2 col-lg-8">
            <div class="card ">
                <div class="card-header card-inverse card-info">
                    {{selecteddealer}} &nbsp; 3S Auto Customer Service - Shuttle daily report
                </div>            
                <div class="card-block">
                    <div *ngIf="RptDates">
                        <label *ngFor="let d of RptDates | async">
                            <input class="radio-inline" type="radio" name="nDrivers" (click)="selectDate(d.$key)" checked="checked"> {{d.$key }} &nbsp; &nbsp;
                        </label><br />
                        <blockquote class="card-blockquote">
                            <table  class="table table-bordered  table-sm">
                                <thead>
                                <tr>
                                    <th> First</th>
                                    <th> Last</th>
                                    <th> Phone</th>
                                    <th>Address</th>
                                    <th>Pickup?</th>
                                    <th>Drop By</th>
                                    <th>Pickup By</th>
                                </tr>
                                </thead>
                                <tr *ngFor="let kk of RptDetails | async">
                                    <td> {{kk.fname }}</td>
                                    <td> {{kk.lname }} </td>
                                    <td> {{kk.phone }} </td>
                                    <td> {{kk.address}} </td>
                                    <td>
                                        <label *ngIf="kk.pickup" [style.color]="kk.pickup ? 'red' : 'green'">Yes </label>
                                        <label *ngIf="!kk.pickup" [style.color]="kk.pickup ? 'red' : 'green'">No </label>
                                    </td>
                                    <td>
                                        {{kk.dropby}} <label *ngIf="kk.dropby">{{kk.droptime}}</label>
                                    </td>
                                    <td>
                                        {{kk.pickupby}} <label *ngIf="kk.pickupby">{{kk.pickuptime}}</label>
                                    </td>
                                </tr>

                            </table>
                        </blockquote>
                    </div>
                </div>
            </div>
            </div>


  `
})

export class Report {
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
    static s_date: any;
    constructor(_parentRouter: Router, public af: AngularFire, public rs: RoleService) {
        this.parentRouter = _parentRouter;

        this.selecteddealer = this.rs.dealer;
        this.uid = this.rs.uid;
        this.ownerid = this.rs.ownerId;
        this.phone = this.rs.phone;
        if (!this.ownerid || !this.selecteddealer) {
            this.parentRouter.navigateByUrl('/admin/AdminLogin');
        }
        //this.af.database.object("/dealers/" + this.selecteddealer).subscribe(res => {
        //    this.ownerid = res.uid;
        //}
        //);
        this.RptDates = this.af.list("/users/" + this.ownerid + "/shuttle");
        this.RptDates.subscribe(r => {
            if (r) r.map(rr => {
                Report.s_date = rr.$key;
            });
        });
        setTimeout(() => {
            this.selectDate(Report.s_date);
        }, 1000);
    }
    selectDate(date: string) {
        if (date !== undefined && date) {
            this.RptDetails = this.af.database.list("/users/" + this.ownerid + "/shuttle/" + date);
        }
    }


}
