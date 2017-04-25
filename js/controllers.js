angular.module('starter.controllers', ['ionic'])

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

    $scope.usernamePlaceholder = 'Введите ваш логин';
    $scope.passwordPlaceholder = 'Введите ваш пароль';
    $scope.usernameplaceholderClass = 'loginInput';
    $scope.passwordPlaceholderClass = 'loginInput';

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalLogin = modal;
    });

    // Open the login modal
    $scope.login = function() {
        $scope.modalLogin.show();
    };

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modalLogin.hide();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        if ($scope.loginData.username.length <= 0) {
            $scope.usernamePlaceholder = 'Вы не ввели логин';
            $scope.usernameplaceholderClass = 'loginColorWarn';
            return;
        }

        if ($scope.loginData.username.length > 15) {
            $scope.usernamePlaceholder = 'Слишком длинный логин';
            $scope.usernameplaceholderClass = 'loginColorWarn';
            return;
        }

        if ($scope.loginData.password.length <= 0) {
            $scope.passwordPlaceholder = 'Вы не ввели пароль';
            $scope.passwordPlaceholderClass = 'loginColorWarn';
            return;
        }

        //$http.post('../res/logins.json');

        $scope.closeLogin();
    };

    // Модальное окно для "Корзины"
    $ionicModal.fromTemplateUrl('templates/shopping-cart.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalShoppingCart = modal;
    });

    // Открыть "Корзину"
    $scope.shoppingCart = function() {
        $scope.modalShoppingCart.show();
    };

    // Закрыть "Корзину"
    $scope.closeShoppingCart = function() {
        $scope.modalShoppingCart.hide();
    };

    // Сделать покупку
    $scope.doPurchase = function() {};
})

.controller('PizzasCtrl', function($scope, DataService) {
    $scope.pizzas = [];

    function refreshData() {
        DataService.loadData().then(
            function(value) {
                $scope.pizzas = value;
            },
            function(reason) {
                DataService.showAlert('Ошибка хз почему', reason);
            }
        ).finally(function() {
            // останавливаем иконку загрузки
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    refreshData();

    $scope.refreshData = refreshData;

    $scope.addPizzaToCart = DataService.addPizzaToCart;
})

.controller('PizzaCtrl', function($scope, $stateParams, DataService) {
    var pizzaId = $stateParams.pizzaId;

    $scope.pizza = DataService.getPizza(pizzaId);

    $scope.addPizzaToCart = DataService.addPizzaToCart;
})

.controller('ShoppingCartCtrl', function($scope, $ionicModal) {

})

.controller('PizzaCreatorCtrl', function($scope) {

});