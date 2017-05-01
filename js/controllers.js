angular.module('starter.controllers', ['ionic'])

.controller('AppCtrl', function($scope, $ionicModal, DataService) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    function isUInt(str) {
        if (str.length <= 0) {
            return false;
        }

        num = +str;

        return isFinite(num) && ((num ^ 0) === num) && num >= 0 && num <= 255;
    }

    // Информация для входа
    $scope.loginData = {
        username: '',
        password: ''
    };

    // Информация для регистрации
    $scope.registrationData = {
        username: '',
        password: '',
        confirmPassword: '',
        firstname: '',
        lastname: '',
        phone: '',
        street: '',
        house: '',
        entrance: '',
        room: '',
        floor: ''
    };

    // Информация для заказа
    $scope.orderData = {
        firstname: '',
        lastname: '',
        phone: '',
        street: '',
        house: '',
        entrance: '',
        room: '',
        floor: ''
    };

    function defaultLoginPlaceholders() {
        $scope.usernamePlaceholder = 'Введите ваш логин';
        $scope.passwordPlaceholder = 'Введите ваш пароль';

        $scope.usernamePlaceholderClass = '';
        $scope.passwordPlaceholderClass = '';
    }

    function defaultRegistrationPlaceholders() {
        $scope.confirmPasswordPlaceholder = 'Повторите ваш пароль';
        $scope.firstnamePlaceholder = 'Введите ваше имя';
        $scope.lastnamePlaceholder = 'Введите вашу фамилию';
        $scope.phonePlaceholder = 'Введите ваш телефон';
        $scope.streetPlaceholder = 'Улица';
        $scope.housePlaceholder = 'Дом';
        $scope.entrancePlaceholder = 'Подъезд';
        $scope.roomPlaceholder = 'Квартира';
        $scope.floorPlaceholder = 'Этаж';

        $scope.confirmPasswordPlaceholderClass = '';
        $scope.firstnamePlaceholderClass = '';
        $scope.lastnamePlaceholderClass = '';
        $scope.phonePlaceholderClass = '';
        $scope.streetPlaceholderClass = '';
        $scope.housePlaceholderClass = '';
        $scope.entrancePlaceholderClass = '';
        $scope.roomPlaceholderClass = '';
        $scope.floorPlaceholderClass = '';
    }

    // Создание окна входа
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalLogin = modal;
    });

    // Открытие модального окна входа
    $scope.login = function() {
        defaultLoginPlaceholders();

        $scope.modalLogin.show();
    };

    // Закрытие модального окна входа
    $scope.closeLogin = function() {
        for (var key in $scope.loginData) {
            $scope.loginData[key] = '';
        }

        defaultLoginPlaceholders();

        $scope.modalLogin.hide();
    };

    // Вход
    $scope.doLogin = function() {
        if ($scope.loginData.username.length <= 0) {
            $scope.loginData.username = '';
            $scope.usernamePlaceholder = 'Вы не ввели логин';
            $scope.usernamePlaceholderClass = 'formError';

            return;
        }

        if ($scope.loginData.username.length > 20) {
            $scope.loginData.username = '';
            $scope.usernamePlaceholder = 'Слишком длинный логин';
            $scope.usernamePlaceholderClass = 'formError';

            return;
        }

        if ($scope.loginData.password.length <= 0) {
            $scope.loginData.password = '';
            $scope.passwordPlaceholder = 'Вы не ввели пароль';
            $scope.passwordPlaceholderClass = 'formError';

            return;
        }

        //$http.post('../res/logins.json');

        $scope.closeLogin();
    };

    // Создание окна регистрации
    $ionicModal.fromTemplateUrl('templates/registration.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalRegistration = modal;
    });

    // Открытие модального окна регистрации
    $scope.registration = function() {
        $scope.closeLogin();

        defaultRegistrationPlaceholders();

        $scope.modalRegistration.show();
    };

    // Закрытие модального окна регистрации
    $scope.closeRegistration = function() {
        for (var key in $scope.registrationData) {
            $scope.registrationData[key] = '';
        }

        defaultLoginPlaceholders();
        defaultRegistrationPlaceholders();

        $scope.modalRegistration.hide();
    };

    // Регистрация
    $scope.doRegistration = function() {
        if ($scope.registrationData.username.length <= 0) {
            $scope.registrationData.username = '';
            $scope.usernamePlaceholder = 'Вы не ввели логин';
            $scope.usernamePlaceholderClass = 'formError';

            return;
        }

        if ($scope.registrationData.username.length > 20) {
            $scope.registrationData.username = '';
            $scope.usernamePlaceholder = 'Слишком длинный логин';
            $scope.usernamePlaceholderClass = 'formError';

            return;
        }

        if ($scope.registrationData.password.length <= 0) {
            $scope.registrationData.password = '';
            $scope.passwordPlaceholder = 'Вы не ввели пароль';
            $scope.passwordPlaceholderClass = 'formError';

            return;
        }

        if ($scope.registrationData.confirmPassword.length <= 0) {
            $scope.registrationData.confirmPassword = '';
            $scope.confirmPasswordPlaceholder = 'Подтвердите ваш пароль';
            $scope.confirmPasswordPlaceholderClass = 'formError';

            return;
        }

        if ($scope.registrationData.confirmPassword !== $scope.registrationData.password) {
            $scope.registrationData.confirmPassword = '';
            $scope.confirmPasswordPlaceholder = 'Пароли не совпадают';
            $scope.confirmPasswordPlaceholderClass = 'formError';

            return;
        }

        if ($scope.registrationData.firstname.length > 20) {
            $scope.registrationData.firstname = '';
            $scope.firstnamePlaceholder = 'Слишком длинное имя';
            $scope.firstnamePlaceholderClass = 'formError';

            return;
        }

        if ($scope.registrationData.lastname.length > 20) {
            $scope.registrationData.lastname = '';
            $scope.lastnamePlaceholder = 'Слишком длинная фамилия';
            $scope.lastnamePlaceholderClass = 'formError';

            return;
        }

        if ($scope.registrationData.street.length > 40) {
            $scope.registrationData.street = '';
            $scope.streetPlaceholder = 'Слишком длинное название';
            $scope.streetPlaceholderClass = 'formError';

            return;
        }

        if ($scope.registrationData.house.length > 0 && !isUInt($scope.registrationData.house)) {
            $scope.registrationData.house = '';
            $scope.housePlaceholder = 'Неверный формат';
            $scope.housePlaceholderClass = 'formError';

            return;
        }

        if ($scope.registrationData.room.length > 0 && !isUInt($scope.registrationData.room)) {
            $scope.registrationData.room = '';
            $scope.roomPlaceholder = 'Неверный формат';
            $scope.roomPlaceholderClass = 'formError';

            return;
        }

        if ($scope.registrationData.entrance.length > 0 && !isUInt($scope.registrationData.entrance)) {
            $scope.registrationData.entrance = '';
            $scope.entrancePlaceholder = 'Неверный формат';
            $scope.entrancePlaceholderClass = 'formError';

            return;
        }

        if ($scope.registrationData.floor.length > 0 && !isUInt($scope.registrationData.floor)) {
            $scope.registrationData.floor = '';
            $scope.floorPlaceholder = 'Неверный формат';
            $scope.floorPlaceholderClass = 'formError';

            return;
        }

        DataService.registration($scope.registrationData, $scope.closeRegistration.bind(this));
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
                DataService.showAlert('Эта ошибка никогда не произойдет', reason);
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

.controller('PizzaCreatorCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, DataService) {
    // Создание окна ингредиентов
    $ionicModal.fromTemplateUrl('templates/ingredients.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalIngredients = modal;
    });

    DataService.loadIngredients().then(
        function(value) {
            $scope.ingredients = value;

            $scope.ingredients.forEach(function(elem) {
                elem.added = false;
            });

            $scope.sauce = $scope.ingredients.filter(function(elem) {
                return elem.type === 'соус';
            });

            $scope.cheese = $scope.ingredients.filter(function(elem) {
                return elem.type === 'сыр';
            });

            $scope.sausage = $scope.ingredients.filter(function(elem) {
                return elem.type === 'колбаса';
            });

            $scope.meat = $scope.ingredients.filter(function(elem) {
                return elem.type === 'мясо';
            });

            // Открытие модального окна ингредиентов
            $scope.openIngredients = function() {
                $scope.modalIngredients.show();
            };
        },
        function(reason) {
            DataService.showAlert('Эта ошибка никогда не произойдет', reason);
        }
    );

    //$scope.addPizzaToCart = DataService.addPizzaToCart;

    $scope.deleteItem = function(item) {
        $scope.items.splice($scope.items.indexOf(item), 1);

        console.log($scope.items);
    };

    // Закрытие модального окна ингредиентов
    $scope.closeIngredients = function() {
        $scope.modalIngredients.hide();

        $scope.items = $scope.ingredients.filter(function(elem) {
            return elem.added;
        });

        console.log($scope.items);
    };

    $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
    };
});