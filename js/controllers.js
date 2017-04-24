angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {
        username: '',
        password: ''
    };

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
        if ($scope.loginData.username.length <= 0) {
            return;
        }

        if ($scope.loginData.username.length > 15) {
            return;
        }

        if ($scope.loginData.password.length <= 0) {
            return;
        }

        //$http.post('../res/logins.json');
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

.controller('PizzasCtrl', function($scope, DataService) {
    DataService.loadData().then(function(value) {
        $scope.pizzas = value;
    });

    $scope.refreshData = function() {
        DataService.loadData().then(function(value) {
            $scope.pizzas = value;
        }).finally(function() {
            // останавливаем иконку загрузки
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
})

.controller('PizzaCtrl', function($scope, $stateParams, DataService) {
    var pizzaId = $stateParams.pizzaId;

    $scope.pizza = DataService.getPizza(pizzaId);
})

.controller('ShoppingCartCtrl', function($scope, $ionicModal) {

})

.controller('PizzaCreatorCtrl', function($scope) {

});