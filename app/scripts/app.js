/* Main App */

var app = angular.module('ICEOapp', [
    'ngStorage',
    'ui.router',
    'ngRoute',
    'angularFileUpload',
    'oc.lazyLoad'
]);
app.run(function ($rootScope, $localStorage) {

    if ($localStorage.token === undefined || $localStorage.token === null) {
        $rootScope.logged = false;
    } else {
        $rootScope.logged = true;
    }

    $rootScope
            .$on('$stateChangeStart',
                    function (event, toState, toParams, fromState, fromParams) {
                        $('.page-loading-overlay').removeClass('loaded');
                    });
    $rootScope
            .$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        $('.page-loading-overlay').addClass('loaded');
                    });
});
app.config(['$urlRouterProvider', '$httpProvider', '$stateProvider', 'SERVICES', 'ASSETS', function ($urlRouterProvider, $httpProvider, $stateProvider, SERVICES, ASSETS) {

        $urlRouterProvider.otherwise("/admin/dashboard");
        $stateProvider.
                state('login', {
                    url: '/login',
                    templateUrl: appHelper.templatePath('auth'),
                    resolve: {
                        checkLogged: function ($rootScope, $location, $localStorage) {

                            if ($localStorage.token === undefined || $localStorage.token === null) {
                                $rootScope.logged = false;
                            } else {
                                $rootScope.logged = true;
                                $location.path("/admin/dashboard");
                            }
                                
                        },
                        location: function ($location) {
                            return $location;
                        },
                        rootScpe: function ($rootScope) {
                            return $rootScope;
                        },
                        resources: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                ASSETS.forms.jQueryValidate,
                                SERVICES.mainService
                            ]);
                        }
                    }
                }).
                state('admin', {
                    abstract: true,
                    url: '/admin',
                    templateUrl: appHelper.templatePath('admin/app-body'),
                    resolve: {
                        checkLogged: function ($rootScope, $location, $localStorage) {
                            if ($localStorage.token === undefined || $localStorage.token === null) {
                                $rootScope.logged = false;
                                $location.path("/login");
                            } else {
                                $rootScope.logged = true;
                            }
                        },
                        location: function ($location) {
                            return $location;
                        },
                        rootScpe: function ($rootScope) {
                            return $rootScope;
                        }
                    }
                }).state('admin.dashboard', {
                    url: '/dashboard',
                    templateUrl: appHelper.templatePath('admin/dashboard')
                }).state('admin.users', {
                    url: '/users',
                    templateUrl: appHelper.templatePath('admin/users')
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
                            $rootScope.errors.push({message: "Your session expired. Please log in again."});
                            $location.path('/auth/logout');
                        }
                        return $q.reject(response);
                    }
                };
            }]);
    }
]);
app.constant("CONFIG", {
    restDomain: "http://localhost/Cloud"
});
app.constant('SERVICES', {
    mainService: appHelper.servicePath("MainService.js")
});
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
    'scripts': {
        'tweenMax': appHelper.assetPath('js/TweenMax.min.js')
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