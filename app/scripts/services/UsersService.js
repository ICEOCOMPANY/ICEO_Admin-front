/* Services and Factories */

var ICEOapp = angular.module('ICEOapp');

ICEOapp.service('UsersService',['$http','$localStorage','$rootScope','CONFIG', function($http,$localStorage,$rootScope,CONFIG){

        var User;
        var UserService = {};

        // Tworzenie użytkownika
        UserService.fetch = function () {
            $http.get(CONFIG.restDomain + '/admin/users').then(
                function(response){
                    console.log("udało się")
                },
                function(response){
                    console.log("błąd")
                }
            );
        };
        
        return UserService;
        
    }]);