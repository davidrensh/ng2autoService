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

@Component({
  // providers :[RoleService],
  directives: [ROUTER_DIRECTIVES, DATEPICKER_DIRECTIVES],
  selector: 'app-booking',
  templateUrl: 'app/Booking.component.html',
  styleUrls: ['app/Booking.component.css']
})

export class BookingComponent {
  switchoildate: boolean = false;
  show: boolean = true;
  Jobs: FirebaseListObservable<any[]>;
  RptDates: FirebaseListObservable<any[]>;
  showall: boolean = false;
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
  bookedchangedate: string;
  comment: string;

  uid: string;
  ownerid: string;
  email: string;
  password: string;

  private parentRouter: Router;
  constructor(_parentRouter: Router, public af: AngularFire, public rs: RoleService) {//,
    //public maps: MapsService, private geolocation: GeolocationService, private geocoding: GeocodingService) {

    this.parentRouter = _parentRouter;
    this.changedate.setDate(new Date().getDate());
    this.bookedchangedate = this.changedate.toISOString().substr(0, 10);
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

    var sdate = (new Date()).toISOString().substr(0, 10);
    this.RptDates = this.af.list("/dealers/" + this.ownerid + "/book");
    this.Jobs = this.af.database.list("/dealers/" + this.ownerid + "/book/" + sdate);
    
  }

  process(d: any) {
    if (!this.comment) this.comment = "";
    this.af.database.object("/dealers/" + this.ownerid + "/book/" + d.bookdate + "/" + d.uid).update({
      processed: true,
      bookedchangedate: this.bookedchangedate,
      processedby: this.fname,
      comment: this.comment
    });

    this.af.database.object("/phone/" + d.phone + "/dealers/" + this.selecteddealer + "/cars/" + d.car).update({
      bookedchangedate: this.bookedchangedate,
      processedby: this.fname,
      comment: this.comment
    });
  }
  selectDate(date: string) {
    //console.log("date=" + date);
    if (date !== undefined && date) {
      this.Jobs = this.af.database.list("/dealers/" + this.ownerid + "/book/" + date);
    }
  }

  setChangeDate(d: Date) {
     console.log("setChangeDate" + d + this.bookedchangedate);
    this.bookedchangedate = d.toISOString().substr(0, 10);
   
  }
  loadChangeDate(d: string) {
    this.changedate = new Date(d);
  }
}