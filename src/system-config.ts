/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  'angularfire2': 'vendor/angularfire2',
  'firebase': 'vendor/firebase/lib/firebase-web.js',
  'angular2-google-maps': 'vendor/angular2-google-maps',
  'ng2-bootstrap': 'vendor/ng2-bootstrap'
  //,
  // 'angular2-in-memory-web-api': 'https://npmcdn.com/angular2-in-memory-web-api', // get latest
  // 'angular2-datatable':         'https://npmcdn.com/angular2-datatable@0.4.0'
  // 'lodash':                     'https://npmcdn.com/lodash@4.6.1/lodash.js'
};

/** User packages configuration. */
const packages: any = {
  'angularfire2': {
    defaultExtension: 'js',
    main: 'angularfire2.js'
  },
  'angular2-google-maps': {
    defaultExtension: 'js',
    main: 'angular2-google-maps.js'
  },
  'ng2-bootstrap': {
    defaultExtension: 'js',
    main: 'ng2-bootstrap.js'
  }
  // 'angular2-in-memory-web-api': { defaultExtension: 'js' },
  // 'angular2-datatable':         { defaultExtension: 'js' }
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/login',
  'app/help',
  'app/admin',
  'app/main',
  'app/booking',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js',
    'moment': 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
