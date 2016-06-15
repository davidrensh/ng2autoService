/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
var map = {
    'angularfire2': 'vendor/angularfire2',
    'firebase': 'vendor/firebase/lib/firebase-web.js',
    'angular2-google-maps': 'vendor/angular2-google-maps',
    'ng2-bootstrap': 'vendor/ng2-bootstrap'
};
/** User packages configuration. */
var packages = {
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
};
////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
var barrels = [
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
];
var cliSystemConfigPackages = {};
barrels.forEach(function (barrelName) {
    cliSystemConfigPackages[barrelName] = { main: 'index' };
});
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
System.config({ map: map, packages: packages });
//# sourceMappingURL=system-config.js.map