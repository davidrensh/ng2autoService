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


import {
    MapsAPILoader,
    NoOpMapsAPILoader,
    MouseEvent,
    ANGULAR2_GOOGLE_MAPS_PROVIDERS,
    ANGULAR2_GOOGLE_MAPS_DIRECTIVES
} from 'angular2-google-maps/core';

import {DATEPICKER_DIRECTIVES} from 'ng2-bootstrap/components/datepicker';
import {TimepickerComponent} from 'ng2-bootstrap/components/timepicker';
// import {GoogleMapDirective} from './google-map.directive';
// import {GoogleMapMarkerDirective} from './google-map-marker.directive';
// // Services.
// import {MapsService} from './maps.service';
// import {GeolocationService} from './geolocation.service';
// import {GeocodingService} from './geocoding.service';


@Component({
    selector: 'home',
    // providers :[RoleService],
    directives: [ROUTER_DIRECTIVES, TimepickerComponent, DATEPICKER_DIRECTIVES, ANGULAR2_GOOGLE_MAPS_DIRECTIVES],//, GoogleMapDirective, GoogleMapMarkerDirective],
    //providers: [MapsService],
    //viewProviders: [GeolocationService, GeocodingService],
    styles: [`
    .sebm-google-map-container {
       height: 300px; width: 700px;
     }
  `],
    templateUrl: 'app/DriverHome.html',
    //<input  type="checkbox" (click)="setshowall()" [checked]="false"> Show all <br>
})

export class DriverHome {
    show: boolean = true;
    Jobs: FirebaseListObservable<any[]>;
    showall: boolean = false;
    showallButtonFace: string = "Only mine";
    switchoildate: boolean = false;
    swicthtiredate: boolean = false;
    //showmap: boolean = false;

    public hstep: number = 1;
    public mstep: number = 5;
    public ismeridian: boolean = false;
    public pickuptime: Date = new Date();
    public changedate: Date = new Date();
    public changetiredate: Date = new Date();
    public changemile: number;

    errmsg: string;
    selecteddealer: string;
    isLoggedIn: boolean = false;
    fname: string;
    lname: string;
    address: string;
    phone: string;
    pickup: boolean;
    pickupcomment: string;

    uid: string;
    ownerid: string;
    email: string;
    password: string;

    //////
    // Center map. Required.
    //center: google.maps.LatLng;

    // MapOptions object specification.

    // The initial map zoom level. Required.
    zoom: number;
    lat: number = 51.673858;
    lng: number = 7.815982;
    static s_lat = 0;
    static s_lng = 0;
    disableDefaultUI: boolean;
    disableDoubleClickZoom: boolean;
    // mapTypeId: google.maps.MapTypeId;
    // maxZoom: number;
    // minZoom: number;
    // styles: Array<google.maps.MapTypeStyle>;

    // Marker position. Required.
    //  position: google.maps.LatLng;

    // Marker title.
    title: string;

    // Info window.
    content: string;

    // Warning flag & message.
    warning: boolean;
    message: string;
    static s_items: any[] = [];
    static s_showall: boolean = false;
    markers: any[] = [];
    private parentRouter: Router;
    constructor(_parentRouter: Router, public af: AngularFire, public rs: RoleService) {//,
        //public maps: MapsService, private geolocation: GeolocationService, private geocoding: GeocodingService) {

        this.parentRouter = _parentRouter;
        this.changedate.setDate(new Date().getDate() + 180);
        this.changetiredate.setDate(new Date().getDate() + 180);
        if (new Date().getHours() + 6 < 24)
            this.pickuptime.setHours(new Date().getHours() + 6);
        this.selecteddealer = this.rs.dealer;
        this.uid = this.rs.uid;
        this.ownerid = this.rs.ownerId;
        this.phone = this.rs.phone;
        this.fname = this.rs.fname;
        this.lname = this.rs.lname;
        //console.log(this.phone);
        if (!this.ownerid || !this.selecteddealer) {
            this.parentRouter.navigateByUrl('/admin/AdminLogin');
        }

        this.showall = true;
        //this.loadJobs(false);
        var sdate = (new Date()).toISOString().substr(0, 10);
        this.Jobs = this.af.database.list("/users/" + this.ownerid + "/shuttle/" + sdate);
        this.af.database.list("/users/" + this.ownerid + "/shuttle/" + sdate, {
            query: {
                limitToLast: 1
            }
        }).subscribe(res => {
            if (res) {
                res.map(function (item) {
                    if (item) {
                        DriverHome.s_lat = item.lat;
                        DriverHome.s_lng = item.lng;
                    }
                });
            }
        }
            );
        setTimeout(() => {
            this.lat = DriverHome.s_lat;
            this.lng = DriverHome.s_lng;

        }, 1000);
        // this.af.database.object("/dealers/" + this.selecteddealer).subscribe(res => {
        //     //console.log("res.uid:" + this.selecteddealer);
        //     //console.log("res.uidee:" + res.uid);
        //     this.ownerid = res.uid;
        //     //this.loadJobs(false);
        // }
        // );

        // Sets initial center map.
        // this.center = new google.maps.LatLng(41.910943, 12.476358);

        // Sets the initial zoom.
        this.zoom = 11;

        // Other options.
        this.disableDefaultUI = true;
        this.disableDoubleClickZoom = false;
        // this.mapTypeId = google.maps.MapTypeId.ROADMAP;
        // this.maxZoom = 15;
        // this.minZoom = 4;
        // // Styled Maps: https://developers.google.com/maps/documentation/javascript/styling
        // // You can use the Styled Maps Wizard: http://googlemaps.github.io/js-samples/styledmaps/wizard/index.html 
        // this.styles = [
        //     {
        //         featureType: 'landscape',
        //         stylers: [
        //             { color: '#ffffff' }
        //         ]
        //     }
        // ];

        this.address = "";

        this.warning = false;
        this.message = "";
    }
    setshowall() {
        if (this.showall === undefined) this.showall = true;
        else 
            this.showall = !this.showall;
         var sdate = (new Date()).toISOString().substr(0, 10);
        if (this.showall) {
            this.showallButtonFace = "Only mine";
            this.Jobs = this.af.database.list("/users/" + this.ownerid + "/shuttle/" + sdate);
        }
        else {
            this.showallButtonFace = "Show all";
            this.Jobs = this.af.database.list("/users/" + this.ownerid + "/shuttle/" + sdate, {
                query: {
                       orderByChild: 'dropby',
                        equalTo: this.fname + " " + this.lname.charAt(0)
                }
            });
        }
        //this.loadJobs(this.showall);
    }

    dropoffCustomer(d: any) {
        var sdate = (new Date()).toISOString().substr(0, 10);
        this.af.database.object("/users/" + this.ownerid + "/shuttle/" + sdate + "/" + d.phone.trim()).update({
            dropoffdone: true,
            dropby:this.fname + " " + this.lname.charAt(0),
            droptime: new Date().toLocaleTimeString()
        });
    }
    pickupCustomer(d: any) {
        var sdate = (new Date()).toISOString().substr(0, 10);
        this.af.database.object("/users/" + this.ownerid + "/shuttle/" + sdate + "/" + d.phone.trim()).update({
            pickupdone: true,
            pickupby: this.fname + " " + this.lname.charAt(0),
            pickuptime: new Date().toLocaleTimeString()
        });
    }
}