/* Main App */

var app = angular.module('ICEOapp', [
    'ngStorage',
    'ui.router',
    'ngRoute',
    'angularFileUpload',
    'oc.lazyLoad'
]);

app.config(['$urlRouterProvider', '$httpProvider', '$stateProvider', 'ASSETS', function ($urlRouterProvider, $httpProvider, $stateProvider, ASSETS) {

        //Router managing paths (input controller)
        /*$routeProvider.
         when('/', {
         templateUrl: 'partials/home.html'
         }).
         when('/signin', {
         templateUrl: 'partials/signin.html'
         }).
         when('/me', {
         templateUrl: 'partials/profile.html'
         }).
         when('/remind', {
         templateUrl: 'partials/remind.html'
         }).
         when('/upload', {
         templateUrl: 'partials/upload.html',
         controller: 'FileCtrl'
         }).
         otherwise({
         redirectTo: '/'
         });*/

        $urlRouterProvider.otherwise("/admin/dashboard");
        $stateProvider.
                state('login', {
                    url: '/login',
                    controller: function ($location, $localStorage) {
                        if ($localStorage.token !== undefined && $localStorage.token !== null) {
                            $location.path("/admin/dashboard");
                        }
                    },
                    templateUrl: appHelper.templatePath('auth'),
                    resolve: {
                        location: function ($location) {
                            return $location;
                        },
                        localStorage: function($localStorage){
                            return $localStorage;
                        },
                        resources: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                ASSETS.forms.jQueryValidate
                            ]);
                        }
                    }
                }).
                state('admin', {
                    abstract: true,
                    url: '/admin',
                    controller: function ($location, $localStorage) {
                        if ($localStorage.token === undefined || $localStorage.token === null) {
                            $location.path("/login");
                        }
                    },
                    templateUrl: appHelper.templatePath('admin/app-body'),
                    reslove: {
                        location: function ($location) {
                            return $location;
                        },
                        localStorage: function($localStorage){
                            return $localStorage;
                        }
                    }
                }).state('admin.dashboard', {
            url: '/dashboard',
            templateUrl: appHelper.templatePath('admin/dashboard'),
            resolve: {
                resources: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        ASSETS.forms.jQueryValidate
                    ]);
                }
            }
        });
        $httpProvider.interceptors.push(['$rootScope', '$q', '$location', '$localStorage', function ($rootScope, $q, $location, $localStorage) {
                return {
                    'request': function (config) {
                        //Inject Authorization header to recognition user
                        config.headers = config.headers || {};
                        if ($localStorage.token) {
                            config.headers.Authorization = $localStorage.token;
                        }
                        return config;
                    },
                    'responseError': function (response) {
                        //If request contains extinct token -> clean $localStorage, token, and redirect to sign in page with error message
                        if (response.status === 401 || response.status === 403) {
                            delete $localStorage.token;
                            $rootScope.token = null;
                            $rootScope.error = "Twoja sesja wygasła! zaloguj się ponownie.";
                            $location.path('/signin');
                        }
                        return $q.reject(response);
                    }
                };
            }]);
    }
]);
app.constant('ASSETS', {
    'core': {
        'bootstrap': appHelper.assetPath('js/bootstrap.min.js'), // Some plugins which do not support angular needs this

        'jQueryUI': [
            appHelper.assetPath('js/jquery-ui/jquery-ui.min.js'),
            appHelper.assetPath('js/jquery-ui/jquery-ui.structure.min.css')
        ],
        'moment': appHelper.assetPath('js/moment.min.js'),
        'googleMapsLoader': appHelper.assetPath('app/js/angular-google-maps/load-google-maps.js')
    },
    'icons': {
        'meteocons': appHelper.assetPath('css/fonts/meteocons/css/meteocons.css'),
        'elusive': appHelper.assetPath('css/fonts/elusive/css/elusive.css')
    },
    'forms': {
        'select2': [
            appHelper.assetPath('js/select2/select2.css'),
            appHelper.assetPath('js/select2/select2-bootstrap.css'),
            appHelper.assetPath('js/select2/select2.min.js')
        ],
        'daterangepicker': [
            appHelper.assetPath('js/daterangepicker/daterangepicker-bs3.css'),
            appHelper.assetPath('js/daterangepicker/daterangepicker.js')
        ],
        'colorpicker': appHelper.assetPath('js/colorpicker/bootstrap-colorpicker.min.js'),
        'selectboxit': appHelper.assetPath('js/selectboxit/jquery.selectBoxIt.js'),
        'tagsinput': appHelper.assetPath('js/tagsinput/bootstrap-tagsinput.min.js'),
        'datepicker': appHelper.assetPath('js/datepicker/bootstrap-datepicker.js'),
        'timepicker': appHelper.assetPath('js/timepicker/bootstrap-timepicker.min.js'),
        'inputmask': appHelper.assetPath('js/inputmask/jquery.inputmask.bundle.js'),
        'formWizard': appHelper.assetPath('js/formwizard/jquery.bootstrap.wizard.min.js'),
        'jQueryValidate': appHelper.assetPath('js/jquery-validate/jquery.validate.min.js'),
        'dropzone': [
            appHelper.assetPath('js/dropzone/css/dropzone.css'),
            appHelper.assetPath('js/dropzone/dropzone.min.js')
        ],
        'typeahead': [
            appHelper.assetPath('js/typeahead.bundle.js'),
            appHelper.assetPath('js/handlebars.min.js')
        ],
        'multiSelect': [
            appHelper.assetPath('js/multiselect/css/multi-select.css'),
            appHelper.assetPath('js/multiselect/js/jquery.multi-select.js')
        ],
        'icheck': [
            appHelper.assetPath('js/icheck/skins/all.css'),
            appHelper.assetPath('js/icheck/icheck.min.js')
        ],
        'bootstrapWysihtml5': [
            appHelper.assetPath('js/wysihtml5/src/bootstrap-wysihtml5.css'),
            appHelper.assetPath('js/wysihtml5/wysihtml5-angular.js')
        ]
    }
});