import {Injectable} from '@angular/core';

@Injectable()
export class RoleService {
    //0  not logged in
    //1. member
    //2. driver
    //3. employee
    //4. owner
    _role: number = 0;
    _dealerName: string = "";
    _uid: string = "";
    _ownerId: string = "";
    _phone: string = '';
    _fname: string = '';
    _lname: string = '';
    set fname(n: string) {
        this._fname = n;
    }
    get fname(): string {
        return this._fname;
    }
    set lname(n: string) {
        this._lname = n;
    }
    get lname(): string {
        return this._lname;
    }
    set phone(rolelevel: string) {
        this._phone = rolelevel;
    }
    get phone(): string {
        return this._phone;
    }
    set role(rolelevel: number) {
        this._role = rolelevel;
        if (rolelevel == 0)
        {
            this._dealerName = "";
            this._uid = "";
            this._ownerId = "";
            this._phone = "";
            this._fname = "";
            this._lname = "";
        }    
    }
    get role(): number {
        return this._role;
    }
    set dealer(dealername: string) {
        this._dealerName = dealername;
    }
    get dealer() {
        return this._dealerName;
    }
    set uid(id: string) {
        this._uid = id;
    }
    get uid() {
        return this._uid;
    }
    set ownerId(id: string) {
        this._ownerId = id;
    }
    get ownerId() {
        return this._ownerId;
    }

    clearPhone(phone: string): string {
        return phone.trim().replace('-', '').replace('_', '').replace('(', '').replace(')', '').replace(' ', '').replace('.', '').replace('+', '');
    }
    genEmail(phone: string): string {
        return this.clearPhone(phone) + '@3s.com';
    }
    getTodayId(): string {
        return (new Date()).toISOString().substr(0, 10);
    }
}