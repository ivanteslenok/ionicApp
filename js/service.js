angular.module('starter.services', [])

.service('DataService', function($http, $q) {
    var pizzas;

    return {
        loadData: function() {
            var defered = $q.defer();
            var self = this;

            $http.get('../res/pizzas.json')
                .success(function(data) {
                    self.pizzas = data.pizzas;
                    defered.resolve(data.pizzas);
                });

            return defered.promise;
        },

        getPizza: function(id) {
            for (var i = 0; i < this.pizzas.length; i++) {
                if (this.pizzas[i].id === parseInt(id)) {
                    return this.pizzas[i];
                }
            }

            return null;
        }
    };
});