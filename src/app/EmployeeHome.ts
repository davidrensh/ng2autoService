
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

import {
    MapsAPILoader,
    NoOpMapsAPILoader,
    MouseEvent,
    ANGULAR2_GOOGLE_MAPS_PROVIDERS,
    ANGULAR2_GOOGLE_MAPS_DIRECTIVES
} from 'angular2-google-maps/core';
// interface marker {
// 	lat: number;
// 	lng: number;
// 	label?: string;
// }

@Component({
    selector: 'homeemp',
    directives: [TAB_DIRECTIVES,ROUTER_DIRECTIVES, TimepickerComponent, DATEPICKER_DIRECTIVES, ANGULAR2_GOOGLE_MAPS_DIRECTIVES, GoogleMapDirective, GoogleMapMarkerDirective],
    providers: [MapsService],
    viewProviders: [GeolocationService, GeocodingService],
    styles: [`
    .sebm-google-map-container {
       height: 300px; width: 700px;
     }
  `],
    templateUrl: 'app/EmployeeHome.html',
})

export class EmployeeHome {
    checked: boolean = false;
    cars: FirebaseListObservable<any[]>;
    //markers: FirebaseListObservable<marker[]>;

    switchoildate: boolean = false;
    swicthtiredate: boolean = false;
    showmap: boolean = false;
    carname: string = "";
    public hstep: number = 1;
    public mstep: number = 5;
    public isspinner: boolean = true;
    public ismeridian: boolean = false;
    public pickuptime: Date = new Date();
    public changedate: Date = new Date();
    public changetiredate: Date = new Date();
    public changedatestr: string = "";
    public changetiredatestr: string = "";
    public changemile: number;
    static s_err: string = "";
    static s_car: any;
    errmsg: string;
    tiremsg: string;
    bookmsg: string;
    oilmsg: string;
    selecteddealer: string;
    isLoggedIn: boolean = false;
    fname: string;
    lname: string;
    address: string;
    phone: string;

    employeephone: string;
    pickup: boolean;
    pickupcomment: string;

    customeruid: string = "";
    uid: string;
    ownerid: string;
    email: string;
    password: string;

    ////
    //Center map. Required.
    center: google.maps.LatLng;

    // MapOptions object specification.
    lat: number = 51.673858;
    lng: number = 7.815982;
    // The initial map zoom level. Required.
    zoom: number;

    disableDefaultUI: boolean;
    disableDoubleClickZoom: boolean;
    mapTypeId: google.maps.MapTypeId;
    maxZoom: number;
    minZoom: number;
    styles: Array<google.maps.MapTypeStyle>;

    // Marker position. Required.
    position: google.maps.LatLng;

    //Marker title.
    title: string;

    // Info window.
    content: string;

    // Warning flag & message.
    warning: boolean;
    message: string;

    private parentRouter: Router;

    constructor(_parentRouter: Router, public af: AngularFire, public rs: RoleService,
        public maps: MapsService, private geolocation: GeolocationService, private geocoding: GeocodingService) {
        this.parentRouter = _parentRouter;
        this.changedate.setDate(new Date().getDate() + 180);
        this.changetiredate.setDate(new Date().getDate() + 180);
        this.changedatestr = this.changedate.toISOString().substr(0, 10);
        this.changetiredatestr = this.changetiredate.toISOString().substr(0, 10);
        if (new Date().getHours() + 6 < 24)
            this.pickuptime.setHours(new Date().getHours() + 6)
        this.pickuptime.setMinutes(0);
        this.selecteddealer = this.rs.dealer;
        this.uid = this.rs.uid;
        this.ownerid = this.rs.ownerId;
        this.employeephone = this.rs.phone;
        //console.log(this.phone);
        if (!this.ownerid || !this.selecteddealer) {
            this.parentRouter.navigateByUrl('/admin/AdminLogin');
        }

        //Sets initial center map.
        this.center = new google.maps.LatLng(41.910943, 12.476358);

        // Sets the initial zoom.
        this.zoom = 4;

        // Other options.
        this.disableDefaultUI = true;
        this.disableDoubleClickZoom = false;
        this.mapTypeId = google.maps.MapTypeId.ROADMAP;
        this.maxZoom = 15;
        this.minZoom = 4;
        // Styled Maps: https://developers.google.com/maps/documentation/javascript/styling
        // You can use the Styled Maps Wizard: http://googlemaps.github.io/js-samples/styledmaps/wizard/index.html 
        this.styles = [
            {
                featureType: 'landscape',
                stylers: [
                    { color: '#ffffff' }
                ]
            }
        ];

        this.address = "";

        this.warning = false;
        this.message = "";
    }
    processRegister(phone: string, fname: string, lname: string, address: string) {

        phone = this.rs.clearPhone(phone);
        this.loadCustomer(phone, false, false);
        setTimeout(() => {
            if (!this.customeruid || this.customeruid === "") this.SaveCustomer(fname, lname, phone, address);
        }, 1000);
    }
    signupShuttle(fname: string, lname: string, phone: string, address: string, pickup: boolean, pickuptime: Date, pickupcomment: any) {
        if (this.customeruid) {

            var sdate = (new Date()).toISOString().substr(0, 10);
            //console.log("address:" + address);
            if (!pickup) pickup = false;
            if (!pickupcomment) pickupcomment = "";
            //console.log(pickuptime.toLocaleTimeString() + " bbb " + pickupcomment);

            this.af.database.object("/phone/" + phone).update({
                lat: this.lat,
                lng: this.lng,
                address: address
            });
            this.af.database.object("/users/" + this.ownerid + "/shuttle/" + sdate + "/" + phone.trim()).update({
                fname: fname,
                lname: lname,
                phone: phone,
                lat: this.lat,
                lng: this.lng,
                address: address,
                dropoffdone: false,
                pickup: pickup,
                pickuptime: pickuptime.toLocaleTimeString(),
                pickupcomment: pickupcomment,
                pickupdone: false
            });

            this.bookmsg = "Booked!";
            setTimeout(() => {
                this.bookmsg = "";
            }, 5000);
        }
        return false;
    }
    clean() {
        this.fname = "";
        this.lname = "";
        this.phone = "";
        this.address = "";
        this.pickup = false;
        this.pickupcomment = "";
        this.carname = "";
        this.changemile = 0;
        this.cars = null;
        this.errmsg = "";
        this.showmap = false;
        this.switchoildate = false;
        this.swicthtiredate = false;
        this.customeruid = "";
        this.checked = false;
        EmployeeHome.s_car = null;
        //this.changedate.setDate(new Date().getDate() + 180);
        //this.changetiredate.setDate(new Date().getDate() + 180);
        if (new Date().getHours() + 6 < 24)
            this.pickuptime.setHours(new Date().getHours() + 6);
    }
    saveOilChange(phone: string, changemile: number, changedate: string, fname: string, lname: string, address: string) {

        //this.processRegister(phone, fname, lname, address);
        this.carname = this.carname.toUpperCase();
        //this.authData0 = authData;
        //this.isSigned = true;
        // console.log("fname:" + fname + lname +  phone  + changemile + changedate );
        // this.uid = localStorage.getItem('uid');
        // login usig the email/password auth provider
        // if (this.uid) {
        this.af.database.object("/phone/" + phone.trim() + "/dealers/" + this.selecteddealer).update({
            dealername: this.selecteddealer,
            uid: this.ownerid
        });
        this.af.database.object("/phone/" + phone.trim() + "/dealers/" + this.selecteddealer + "/cars/" + this.carname).update({
            car: this.carname,
            changemile: changemile,
            changedate: changedate
        });
        this.cars = this.af.database.list("/phone/" + this.phone.trim() + "/dealers/" + this.selecteddealer + "/cars");
        this.oilmsg = "Saved!";
        setTimeout(() => {
            this.oilmsg = "";
        }, 5000);
        // }


    }
    saveTireChange(phone: string, changetiredate: string, fname: string, lname: string, address: string) {
        this.carname = this.carname.toUpperCase();
        // this.processRegister(phone, fname, lname, address);
        //this.authData0 = authData;
        //this.isSigned = true;
        //console.log("fname:" + fname + lname +  phone + changetiredate);
        // this.uid = localStorage.getItem('uid');
        // login usig the email/password auth provider
        // if (this.uid) {
        this.af.database.object("/phone/" + phone.trim() + "/dealers/" + this.selecteddealer).update({
            dealername: this.selecteddealer,
            uid: this.ownerid
        });
        this.af.database.object("/phone/" + phone.trim() + "/dealers/" + this.selecteddealer + "/cars/" + this.carname).update({
            car: this.carname,
            changetiredate: changetiredate
        });
        this.cars = this.af.database.list("/phone/" + this.phone.trim() + "/dealers/" + this.selecteddealer + "/cars");
        this.tiremsg = "Saved!";
        setTimeout(() => {
            this.tiremsg = "";
        }, 5000);
        // }


    }

    SaveCustomer(fname: string, lname: string, phone: string, address) {//storename: string, renewYears: number, maxPurchase: number, maxRedeem: number) {
        phone = this.rs.clearPhone(phone);
        var e = this.rs.genEmail(phone);
        EmployeeHome.s_err = "";
        this.customeruid = "";
        let password = lname.trim().toLowerCase();
        localStorage.setItem('uid', "");
        this.af.auth.createUser({
            email: e,
            password: password
        }).then(function (authdata) {
            localStorage.setItem('uid', authdata.uid);
        }).catch(function (error) {
            switch (error.code) {
                case "INVALID_EMAIL":
                    EmployeeHome.s_err = "The specified phone is invalid.";
                    break;
                default:
                    EmployeeHome.s_err = "Error creating user:" + error;
                    break;
                case "EMAIL_TAKEN":
                    EmployeeHome.s_err = "The new customer account cannot be created because the phone is already in use. Use the credential to login.";
                    break;
            }
            return;
        });


        setTimeout(() => {

            this.errmsg = EmployeeHome.s_err;

            let uid = localStorage.getItem('uid');

            //console.log("uid::" + uid);
            //console.log("SaveCustomer:" + uid + fname + lname + phone + address);
            if (uid != "") {
                this.customeruid = uid;

                //console.log("uid:" + uid + fname + lname + phone+ employeeaddress)
                this.af.object("/users/" + uid).update({
                    uid: uid,
                    email: "",
                    fname: fname,
                    lname: lname,
                    phone: phone,
                    role: 1,
                    ownerid: "",
                    dealername: "",
                    password: password,
                    address: address
                });
                this.af.database.object("/phone/" + phone).update({
                    uid: uid,
                    email: "",
                    fname: fname,
                    lname: lname,
                    phone: phone,
                    address: address
                });
            }

        }, 1200);
        setTimeout(() => {
            this.errmsg = "";
        }, 10000);
    }
    doneTypingPhone(phone: string) {
        this.loadCustomer(phone, true, true);
    }
    loadCustomer(phone: string, showErr: boolean, isClean: boolean) {

        // console.log("checked" + this.checked);
        if (isClean) this.clean();
        this.phone = this.rs.clearPhone(phone);
        //console.log("loadCustomer:" + phone + showErr + this.selecteddealer);
        if (!this.selecteddealer || this.selecteddealer == "" || !this.phone || this.phone.trim() == "")
            return;
        this.errmsg = "";
        this.af.database.object("/phone/" + this.phone).subscribe(res => {
            this.checked = true;
            if (res && res.uid !== undefined) {
                //console.log("3333" + res.uid);
                this.customeruid = res.uid;
                this.fname = res.fname;
                this.lname = res.lname;
                //console.log("add:" + res.address);
                if (res.address)
                    this.address = res.address;
                else this.address = "";
                //this.phone = res.phone;
                this.cars = this.af.database.list("/phone/" + this.phone.trim() + "/dealers/" + this.selecteddealer + "/cars");
                this.cars.subscribe(re => {
                    re.map(function (item) {
                        EmployeeHome.s_car = item;
                    });
                });
            } else {
                this.customeruid = "";
                //console.log("Phpon2222" + phone + showErr + this.selecteddealer);
                if (showErr) {
                    this.errmsg = "Not register yet.";
                    setTimeout(() => {
                        this.errmsg = "";
                    }, 5000);
                }
            }
        }
        );

        setTimeout(() => {
            // console.log("sname:" + sname);

            if (!this.errmsg && EmployeeHome.s_car) {
                this.loadCar(EmployeeHome.s_car);
            }
        }, 1000);
    }

    deleteCar(carname: string) {
        this.af.database.object("/phone/" + this.phone.trim() + "/dealers/" + this.selecteddealer + "/cars/" + carname).remove();
    }
    loadCar(res: any) {
        this.carname = res.car.toUpperCase();
        //this.af.database.object("/phone/" + this.phone.trim() + "/" + this.selecteddealer + "/cars/" + car).subscribe(res => {
        //console.log("null:" + JSON.stringify(res));
        if (res.changetiredate) {
            this.changetiredate = new Date(res.changetiredate);
            this.changetiredatestr = res.changetiredate;
        }
        if (res.changemile)
            this.changemile = res.changemile;
        if (res.changedate) {
            this.changedate = new Date(res.changedate);
            this.changedatestr = res.changedate;
        }
        // }
        // );
    }
    setChangeTireDate(d: Date) {
        this.changetiredatestr = d.toISOString().substr(0, 10);
    }
    setChangeDate(d: Date) {
        this.changedatestr = d.toISOString().substr(0, 10);
    }

    loadChangeTireDate(d: string) {
        this.changetiredate = new Date(d);
    }
    loadChangeDate(d: string) {
        this.changedate = new Date(d);
    }
    doneTypingLname($event) {
        this.errmsg = "";
        if ($event.which === 13) {

        }
    }
    doneTypingEmail($event, passctl) {
        passctl.focus();
        passctl.select();

    }
    // Searches the address. 
    search(address: string) {

        if (address != "") {
            this.showmap = true;
            this.warning = false;
            this.message = "";
            // Converts the address into geographic coordinates.
            this.geocoding.codeAddress(address).forEach(
                // Next.
                (results: google.maps.GeocoderResult[]) => {
                    if (!this.center.equals(results[0].geometry.location)) {
                        // Sets the new center map & zoom.
                        // New center object: triggers OnChanges.
                        this.lat = results[0].geometry.location.lat();
                        this.lng = results[0].geometry.location.lng();
                        //this.center = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                        this.zoom = 11;
                        // Sets the marker to the center map.
                        //this.setMarker(this.center, "search result", results[0].formatted_address);
                        //console.log('this.center service: .' + this.center);
                    }
                }, null

            ).then(

                () => {
                    // Clears the search string.
                    //this.address = "";
                    //console.log('Geocoding service: completed.');
                }
                ).catch(
                (status: google.maps.GeocoderStatus) => {
                    // Zero results.
                    if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {

                        this.message = "zero results";
                        this.warning = true;
                    }
                });

        }

    }

}