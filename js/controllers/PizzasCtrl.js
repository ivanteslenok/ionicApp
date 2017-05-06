(function() {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('PizzasCtrl', Pizzas);

    function Pizzas($scope, DataService) {
        $scope.pizzas = [];

        function refreshData() {
            DataService.loadData().then(
                function(value) {
                    $scope.pizzas = value;
                },
                function(reason) {
                    DataService.showAlert('Эта ошибка никогда не произойдет');
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