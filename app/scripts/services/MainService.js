/* Services and Factories */

var ICEOapp = angular.module('ICEOapp');

/**
 * Service to handle basic functions
 */
ICEOapp.factory('MainFactory', ['$http', '$localStorage', 'CONFIG', function ($http, $localStorage, CONFIG) {

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();

        //set Content-Type to prevent browser from send preflight OPTIONS to domain
        $http.defaults.headers.post["Content-Type"] = 'text/plain';
        $http.defaults.headers.put["Content-Type"] = 'text/plain';

        return {
            profile: function(success, error){
                $http.get(CONFIG.restDomain + '/admin/auth').success(success).error(error)
            },
            signin: function (data, success, error) {
                $http.post(CONFIG.restDomain + '/admin/auth', data).success(success).error(error)
            },
            logout: function (success, error) {
                $http.delete(CONFIG.restDomain + '/admin/auth').success(success).error(error)
                changeUser({});
            },
        };
    }
    ]);