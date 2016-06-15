/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/*.js',
      'es6-shim/es6-shim.js',
      'reflect-metadata/*.js',
      'rxjs/**/*.js',
      '@angular/**/*.js',
      // above are the existing entries
      // below are the AngularFire entries
      'angularfire2/**/*.js',
      'firebase/lib/*.js',
      'ng2-bootstrap/**/*.js',
      'angular2-google-maps/**/*.js',
      'angular2-datatable/**/*.js'
    ]
  });
};
