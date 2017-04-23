angular.module('starter.services', [])

.factory('Pizzas', function($http, $q) {
    return {
        getAll: function() {
            var defered = $q.defer();

            $http.get('../res/pizzas.json')
                .success(function(data) {
                    defered.resolve(data.pizzas);
                });

            return defered.promise;
        },

        getOne: function(id) {
            var defered = $q.defer();
            var url = '../res/pizza' + id + '.json';

            $http.get(url)
                .success(function(data) {
                    defered.resolve(data);
                });

            return defered.promise;
        }
    };
});