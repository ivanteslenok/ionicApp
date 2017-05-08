(function() {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('PizzasCtrl', Pizzas);

    function Pizzas($scope, DataService) {
        DataService.showLoading();

        $scope.pizzas = [];

        function refreshData() {
            DataService.loadData().then(
                function(value) {
                    $scope.pizzas = value;
                    DataService.hideLoading();
                },
                function(reason) {
                    DataService.hideLoading();
                }
            ).finally(function() {
                // останавливаем иконку загрузки
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        refreshData();

        $scope.refreshData = refreshData;

        $scope.addPizzaToCart = DataService.addPizzaToCart;
    }
})();