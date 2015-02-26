/* Admin Controllers */

var ICEOapp = angular.module('ICEOapp');

/**
 * BaseController use for manage menu
 */
ICEOapp.controller('MenuCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'MainFactory', function ($rootScope, $scope, $location, $localStorage, MainFactory) {

        if ($rootScope.logged) {
            MainFactory.profile(function (res) {
                //save user data to profile object
                $scope.admin = {
                    id: res.id,
                    login: res.login
                }
            }, function () {
                $scope.error = 'Error fetching data';
            });
        }

        $scope.logout = function () {
            MainFactory.logout(function () {
                delete $localStorage.token;
                $location.path("/login");
            }, function () {
                console.log("Logout error");
            });
            $rootScope.token = null;
        };

        //Set token to inform that user is authenticated
        $rootScope.token = $localStorage.token;

    }]);

/**
 * Admin dashboard
 */
ICEOapp.controller('AdminDashboardCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {

    }]);

/**
 * Users Page
 */
ICEOapp.controller('AdminUsersCtrl', ['$rootScope', '$scope', 'UsersService', function($rootScope, $scope, UsersService){
        
        $scope.users = UsersService.fetch();
        //Tutaj skończyłem czytanie userów!
        console.log($scope.users)
        
}])

