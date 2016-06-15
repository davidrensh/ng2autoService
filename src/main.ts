
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide, Component } from '@angular/core';
import { MainComponent, environment } from './app/';
import { RoleService } from './app/role.service';
import {ANGULAR2_GOOGLE_MAPS_PROVIDERS} from 'angular2-google-maps/core';
import {LocationStrategy,HashLocationStrategy} from '@angular/common';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/components/dropdown';
import {
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS,
     Router
} from '@angular/router';

import {AngularFire, FIREBASE_PROVIDERS,
    defaultFirebase,
    firebaseAuthConfig,
    AuthMethods,
    AuthProviders} from 'angularfire2';

if (environment.production) {
  enableProdMode();
}

bootstrap(MainComponent, [
    RoleService,
    FIREBASE_PROVIDERS,ANGULAR2_GOOGLE_MAPS_PROVIDERS,
    defaultFirebase('https://3s.firebaseio.com'), firebaseAuthConfig({
        method: AuthMethods.Password,
        provider: AuthProviders.Password,
        remember: 'default',
        scope: ['email']
    }),
    ROUTER_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
