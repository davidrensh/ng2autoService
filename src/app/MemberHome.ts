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

@Component({
    selector: 'home',
    //providers :[RoleService],

    directives: [ROUTER_DIRECTIVES],
    template: `
<div class=" text-xs-center text-lg-center  text-md-center col-xs-12 col-sm-12  col-md-8 col-lg-offset-2 col-lg-8">
    <div class="card ">
        <div class="card-header card-inverse card-info">
            3S Auto Customer Service - {{fname}} {{lname}} {{phone}}
        </div>
        <div class="card-block">
            <div *ngIf="dealers">
                <label *ngFor="let d of dealers | async">
                    <input class="radio-inline" type="radio" name="ndealers" (click)="selectDealer(d)" checked="checked"> {{d.dealername }}  &nbsp; &nbsp;
                </label>
            </div>
            <div class="card-group">
            <div class="card  text-xs-left  text-lg-left" *ngFor="let k of cars | async">
                <div class="card-header">
                    {{k.car}}
                </div>
                <div class="card-block">
                    <p class="card-text">    
                        Next oil chnage mileage: <span style="color:green">{{k.changemile}}</span><br>
                        Next oil change date: <span style="color:orange">{{k.changedate}}</span><br>
                        Next tire change date: <span style="color:orange">{{k.changetiredate}}</span><br>
                        My comment:  <span style="color:GoldenRod">{{k.mycomment}}</span>
                    </p>
                    <div *ngIf="k.bookedchangedate" class="alert alert-danger" role="alert">
                        Booked service date: <span style="color:red">{{k.bookedchangedate}}</span><br>
                        Processed by: {{k.processedby}} 
                        <span style="color:red">{{k.comment}}</span>
                    </div>
                </div>
                <div class="card-footer text-xs-center  text-lg-center">
                    <input class="form-control" [(ngModel)]="comment" placeholder="Comment" >
                    <button class="btn btn-primary-outline btn-sm" (click)="bookOil(k, comment)">Book service</button>
                    <div *ngIf="bookmsg" style="color:green">
                        {{bookmsg}}
                    </div>
                </div>
            </div>
            </div>
        </div>

        <div class="card-footer text-xs-center  text-lg-center alert alert-warning">
                <strong>FYI:</strong> Your previous service store will call you after you click "Book service" button.
        </div>
    </div>
</div>  `
})

export class MemberHome {
    dealers: FirebaseListObservable<any[]>;
    static s_dealer: any;
    loaded: boolean = false;
    switchoildate: boolean = false;
    swicthtiredate: boolean = false;
    showmap: boolean = false;
    carname: string = "";
    public hstep: number = 1;
    public mstep: number = 5;
    public ismeridian: boolean = false;
    public pickuptime: Date = new Date();
    public changedate: Date = new Date();
    public changetiredate: Date = new Date();
    public changemile: number;
    bookmsg: string = "";
    errmsg: string;
    selecteddealer: string;
    fname: string;
    lname: string;
    address: string;
    phone: string;
    pickup: boolean;
    pickupcomment: string;
    comment: string = "";
    uid: string;
    ownerid: string;
    email: string;
    password: string;

    cars: FirebaseListObservable<any[]>;
    private parentRouter: Router;
    constructor(_parentRouter: Router, public af: AngularFire, public rs: RoleService) {
        this.parentRouter = _parentRouter;
        //this.selecteddealer = this.rs.dealer;
        this.uid = this.rs.uid;
        // //this.ownerid = this.rs.ownerId;
        this.phone = this.rs.phone;
        //  this.fname = this.rs.fname;
        //     this.lname = this.rs.lname;
        this.dealers = this.af.list("/phone/" + this.phone + "/dealers");
        this.dealers.subscribe(r => {
            if (r) r.map(rr => {
                MemberHome.s_dealer = rr;
            });
        });
        setTimeout(() => {
            this.selectDealer(MemberHome.s_dealer);
        }, 1000);

    }
    selectDealer(d: any) {
        this.selecteddealer = d.dealername;
        this.ownerid = d.uid;
        this.load(this.phone);
    }
    bookOil(d: any, comment: string) {
        let s = this.rs.getTodayId();

        this.af.database.object("/dealers/" + this.ownerid + "/book/" + s + "/" + this.uid).update({
            bookdate: s,
            car: d.car,
            fname: this.fname,
            lname: this.lname,
            phone: this.phone,
            uid:this.uid,
            processed: false,
            mycomment: comment
        });
        this.af.database.object("/phone/" + this.phone + "/dealers/" + this.selecteddealer + "/cars/" + d.car).update({
            bookedchangedate: "",
            mycomment: comment
        });
        this.bookmsg = "Booked";
        setTimeout(() => {
            this.bookmsg = "";
        }, 5000);
    }
    load(phone: string) {
        //console.log("aa:" + this.selecteddealer + this.phone);
        //if (!this.selecteddealer || this.selecteddealer == "" || !phone || phone.trim() == "")
        //    return;
        this.loaded = true;
        this.af.database.object("/phone/" + this.rs.clearPhone(phone)).subscribe(res => {
            if (res) {
                if (res.fname) this.fname = res.fname;
                if (res.lname) this.lname = res.lname;
                // this.address = res.address;
                this.phone = res.phone;
            }
        }
        );
        this.cars = this.af.database.list("/phone/" + this.rs.clearPhone(phone) + "/dealers/" + this.selecteddealer + "/cars");
        return false;

    }
}

