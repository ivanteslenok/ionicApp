(function() {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('PizzaCtrl', Pizza);

    function Pizza($scope, $stateParams, DataService) {
        var pizzaId = $stateParams.pizzaId;

        $scope.pizza = DataService.getPizza(pizzaId);

        $scope.addPizzaToCart = DataService.addPizzaToCart;
    }
})();