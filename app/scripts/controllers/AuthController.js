/* Main Controllers */

var ICEOapp = angular.module('ICEOapp');

/**
 * SignInCtrl allows user to authentication
 */
ICEOapp.controller('SignInCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, MainFactory) {
$('.page-loading-overlay').addClass('loaded');
        //Function runs when user sign in on website
        $scope.signin = function () {
            var formData = {
                login: $scope.login,
                password: $scope.password
            }
            //Use MainFactory from services.js
            MainFactory.signin(formData, function (res) {
                if (res.token) {
                    $localStorage.token = res.token;
                    $rootScope.token = $localStorage.token;
                    $location.path("/admin/dashboard");
                } else {
                    $location.path("/login");
                    $scope.loginError = 'Wrong username or password, try again!';
                }
            }, function () {
                $location.path("/login");
                $scope.loginError = 'Wrong username or password, try again!';
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