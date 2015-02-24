/* Controllers */

var ICEOapp = angular.module('ICEOapp');

/**
 * BaseController use for manage menu
 */
ICEOapp.controller('BaseCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, MainFactory) {

    console.log("eaea");

    //Check token and redirect if user want to access a area he can't
    $scope.$on('$routeChangeSuccess', function (event, next, current) {
        if ($localStorage.token !== undefined && $localStorage.token !== null) {
            //paths allows for guests, logged users cannot see them
            var guestPaths = ["/login"];

            angular.forEach(guestPaths, function (value, key) {
                if (value == next.originalPath) {
                    $location.path("/");
                }
            });

        } else {
            //paths reserved for logged users (secure area)
            var securedPaths = ["/admin"];

            angular.forEach(securedPaths, function (value, key) {
                if (value == next.originalPath) {
                    $location.path("/");
                }
            });

        }
    });

    $scope.logout = function () {
        MainFactory.logout(function () {
            delete $localStorage.token;
            $location.path("/");
        }, function () {
            console.log("Nie udało się wylogować");
        });
        $rootScope.token = null;
    };

    //Set token to inform that user is authenticated
    $rootScope.token = $localStorage.token;

}]);

/**
 * ActivateCtrl redirect user straight to server to activate
 */
ICEOapp.controller('ActivateCtrl', ['$rootScope', '$scope', '$location', '$localStorage', '$route', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, $routeProvider, MainFactory) {

    console.log($routeProvider.current.params.key);
    var formData = {
        key: $routeProvider.current.params.key
    }
    MainFactory.activate(formData, function (res) {
        $scope.success = 'Poprawnie aktywowano konto';
    }, function () {
        $scope.error = 'Wystąpił błąd przy aktywacji';
    })

}]);

/**
 * SignInCtrl allows user to authentication
 */
ICEOapp.controller('SignInCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, MainFactory) {

    //Function runs when user sign in on website
    $scope.signin = function () {
        var formData = {
            login: $scope.login,
            password: $scope.password
        }
        //Use MainFactory from services.js
        MainFactory.signin(formData, function (res) {
            if (res.token == false) {
                console.log(res)
            } else {
                $localStorage.token = res.token;
                $rootScope.token = $localStorage.token;
                $location.path("/");
            }
        }, function () {
            $scope.error = 'Błąd przy logowaniu, sprawdź login lub hasło';
        });
    };

}]);

/**
 * ProfileCtrl - retrieve user data
 */
ICEOapp.controller('ProfileCtrl', ['$scope', 'MainFactory', function ($scope,MainFactory) {

    MainFactory.profile(function (res) {
        //save user data to profile object
        $scope.profile = {
            id: res.id,
            email: res.email,
            registered: res.registered
        }
    }, function () {
        $scope.error = 'Błąd przy pobieraniu danych';
    });

}]);

/**
 * RemindCtrl use for remind user password
 */
ICEOapp.controller('RemindCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, MainFactory) {

    //Remind password
    $scope.remind = function () {
        var formData = {
            email: $scope.email
        }
        MainFactory.remind(formData, function () {
            alert("Nowe hasło wyslano na e-mail");
        }, function () {
            $scope.error = "Wystąpił błąd przy przypomnieniu hasła!";
        });
    };

}]);

/**
 * ResetCtrl to reset user password
 */
ICEOapp.controller('ResetCtrl', ['$rootScope', '$scope', '$route', 'MainFactory', function ($rootScope, $scope, $route, MainFactory) {

    //Reset password if key is valid
    $scope.reset = function () {
        var formData = {
            new_password: $scope.new_password,
            repeat_new_password: $scope.repeat_new_password,
            key:  $route.current.params.param
        }
        MainFactory.reset(formData, function () {
            alert("Nowe hasło zostało wygenerowane");
        }, function () {
            alert("Wystąpił błąd przy generowaniu hasła!");
        });
    };

}]);

/**
 * FileController to upload files
 */
ICEOapp.controller('FileCtrl', ['$rootScope', '$scope', '$upload', 'MainFactory', function ($rootScope, $scope, $upload, MainFactory) {

    //Upload via angular-file-upload module, you can use drag&drop for further information see: https://github.com/danialfarid/angular-file-upload#manual
    var url = "http://back.core.iceo.zone/files";
    $scope.$watch('files', function () {
        if ($scope.files !== undefined) {
            $scope.upload = $upload.upload({
                url: url,
                data: {myObj: $scope.myModelObj},
                file: $scope.files
            }).progress(function (event) {
                $scope.success = "Upload pliku " + parseInt(100.0 * event.loaded / event.total) + "%";
            }).success(function (data, status, headers, config) {
                $scope.success = "Poprawnie dodano plik " + data.original_name + "!"
            }).error(function () {
                $scope.success = "Wystąpił bład w uploadzie!"
            });
        }
    });

}]);