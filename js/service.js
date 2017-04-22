angular.module('starter.services', [])

.factory('Pizzas', function($http) {
    var pizzas;

    $http.get('../res/pizzas.json').success(function(data) {
        pizzas = data.pizzas;
    });

    return {
        all: function() {
            return pizzas;
        },
        get: function(id) {
            for (var i = 0; i < pizzas.length; i++) {
                if (pizzas[i].id === parseInt(id)) {
                    return pizzas[i];
                }
            }
            return null;
        }
    };
});