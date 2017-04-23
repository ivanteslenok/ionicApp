angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalLogin = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modalLogin.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modalLogin.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };

    // Модальное окно для "Корзины"
    $ionicModal.fromTemplateUrl('templates/shopping-cart.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalShoppingCart = modal;
    });

    // Закрыть "Корзину"
    $scope.closeShoppingCart = function() {
        $scope.modalShoppingCart.hide();
    };

    // Открыть "Корзину"
    $scope.shoppingCart = function() {
        $scope.modalShoppingCart.show();
    };

    // Сделать покупку
    $scope.doPurchase = function() {};
})

.controller('PizzasCtrl', function($scope, Pizzas) {
    Pizzas.getAll().then(function(value) {
        $scope.pizzas = value;
    });

    $scope.refreshData = function() {
        Pizzas.getAll().then(function(value) {
            $scope.pizzas = value;
        }).finally(function() {
            // останавливаем иконку загрузки
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    // $http.get('../res/pizzas.json').success(function(data) {
    //     $scope.pizzas = data.pizzas;
    // });
})

.controller('PizzaCtrl', function($scope, $stateParams, Pizzas) {
    var pizzaId = $stateParams.pizzaId;

    Pizzas.getOne(pizzaId).then(function(value) {
        $scope.pizza = value;
    });

    //$scope.presentPizza = Pizzas.getOne(pizzaId);

    // $http.get('../res/pizzas.json').success(function(data) {
    //     $scope.presentPizza = data.pizzas.filter(function(elem) {
    //         return elem.id == pizzaId;
    //     });
    // });
})

.controller('ShoppingCartCtrl', function($scope, $ionicModal) {

})

.controller('PizzaCreatorCtrl', function($scope) {

});