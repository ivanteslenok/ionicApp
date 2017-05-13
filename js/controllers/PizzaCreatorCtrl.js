(function() {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('PizzaCreatorCtrl', PizzaCreator);

    function PizzaCreator($scope, $ionicModal, $ionicSlideBoxDelegate, DataService) {
        // Создание окна ингредиентов
        $ionicModal.fromTemplateUrl('templates/ingredients.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalIngredients = modal;
        });

        $scope.addBtnDisabled = false;

        $scope.addToCartBtnDisabled = true;

        $scope.totalPrice = 0;

        var ingredients = [];

        // Открытие модального окна ингредиентов
        $scope.openIngredients = function() {
            $scope.addBtnDisabled = true;
            DataService.showLoading();

            DataService.loadIngredients().then(
                function(value) {
                    ingredients = value;

                    // ingredients.forEach(function(elem) {
                    //     elem.added = false;
                    // });

                    $scope.sauce = ingredients.filter(function(elem) {
                        return elem.type === 'соус';
                    });

                    $scope.cheese = ingredients.filter(function(elem) {
                        return elem.type === 'сыр';
                    });

                    $scope.sausage = ingredients.filter(function(elem) {
                        return elem.type === 'колбаса';
                    });

                    $scope.meat = ingredients.filter(function(elem) {
                        return elem.type === 'мясо';
                    });

                    $scope.backBtnDisable = true;
                    $scope.readyBtnDisable = false;
                    $scope.nextBtnDisable = false;
                    $scope.modalIngredients.show();
                    DataService.hideLoading();
                    $scope.addBtnDisabled = false;

                },
                function(reason) {
                    DataService.hideLoading();
                    $scope.addBtnDisabled = false;
                }
            );
        };

        $scope.addToCart = function() {
            DataService.addCustomPizzaToCart($scope.items, $scope.totalPrice);
        };

        $scope.deleteItem = function(item) {
            $scope.items.splice($scope.items.indexOf(item), 1);

            $scope.totalPrice -= +item.price;
            $scope.totalPrice = $scope.totalPrice.toFixed(2);

            item.added = false;

            if ($scope.items.length <= 0) {
                $scope.addToCartBtnDisabled = true;
            }
        };

        // Закрытие модального окна ингредиентов
        $scope.closeIngredients = function() {
            $scope.modalIngredients.hide();
        };

        $scope.checkItems = function() {
            if ($scope.items && $scope.items.length > 0) {
                $scope.readyBtnDisable = false;
            } else {
                $scope.readyBtnDisable = true;
            }
        };

        // Заполнение списка выбранных ингредиентов
        $scope.createList = function() {
            $scope.items = ingredients.filter(function(elem) {
                return elem.added;
            });

            $scope.totalPrice = 0;

            $scope.items.forEach(function(elem) {
                $scope.totalPrice += +elem.price;
            });

            $scope.totalPrice = $scope.totalPrice.toFixed(2);

            if ($scope.items.length <= 0) {
                $scope.addToCartBtnDisabled = true;
            } else {
                $scope.addToCartBtnDisabled = false;
            }

            $scope.modalIngredients.hide();
        };

        $scope.nextSlide = function() {
            $ionicSlideBoxDelegate.next();
        };

        $scope.previousSlide = function() {
            $ionicSlideBoxDelegate.previous();
        };

        $scope.slideChanged = function(index) {
            switch (index) {
                case 0:
                    $scope.backBtnDisable = true;
                    $scope.nextBtnDisable = false;
                    break;
                case 1:
                    $scope.backBtnDisable = false;
                    $scope.nextBtnDisable = false;
                    break;
                case 2:
                    $scope.backBtnDisable = false;
                    $scope.nextBtnDisable = false;
                    break;
                case 3:
                    $scope.backBtnDisable = false;
                    $scope.nextBtnDisable = true;
                    break;
            }
        };
    }
})();