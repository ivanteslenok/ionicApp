(function() {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('AppCtrl', App);

    function App($scope, $ionicModal, DataService) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Data

        // Информация для входа
        var loginData = {
            username: null,
            password: null
        };

        $scope.loginInputData = {
            username: null,
            password: null
        };

        // Информация для регистрации
        var registrationData = {
            username: null,
            password: null,
            firstname: null,
            lastname: null,
            phone: null,
            street: null,
            house: null,
            entrance: null,
            room: null,
            floor: null
        };

        $scope.registrationInputData = {
            username: null,
            password: null,
            confirmPassword: null,
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
        var orderData = {
            firstname: null,
            lastname: null,
            phone: null,
            street: null,
            house: null,
            entrance: null,
            room: null,
            floor: null
        };

        $scope.loginBtnDisabled = false;
        $scope.registerBtnDisabled = false;

        $scope.additionalData = false;

        // Создание окна входа
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalLogin = modal;
        });

        // Открытие модального окна входа
        $scope.login = login;

        // Закрытие модального окна входа
        $scope.closeLogin = closeLogin;

        // Вход
        $scope.doLogin = doLogin;

        // Создание окна регистрации
        $ionicModal.fromTemplateUrl('templates/registration.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalRegistration = modal;
        });

        // Открытие модального окна регистрации
        $scope.registration = registration;

        $scope.showAdditional = showAdditional;

        // Закрытие модального окна регистрации
        $scope.closeRegistration = closeRegistration;

        // Регистрация
        $scope.doRegistration = doRegistration;

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

        // Functions

        function login() {
            defaultLoginPlaceholders();
            $scope.loginBtnDisabled = false;
            $scope.modalLogin.show();
        }

        function closeLogin() {
            $scope.modalLogin.hide();

            for (var key in $scope.loginInputData) {
                $scope.loginInputData[key] = null;
            }

            defaultLoginPlaceholders();
        }

        function doLogin() {
            if (!validateLogin()) {
                return;
            }

            loginData.username = $scope.loginInputData.username.trim();
            loginData.password = $scope.loginInputData.password.trim();

            $scope.loginBtnDisabled = true;

            DataService.login(loginData).then(
                function(value) {
                    if (value.success) {
                        closeLogin();
                    } else {
                        $scope.loginBtnDisabled = false;
                    }
                },
                function(reason) {
                    DataService.showAlert('Эта ошибка никогда не произойдет');
                }
            );
        }

        function registration() {
            closeLogin();
            defaultRegistrationPlaceholders();
            $scope.registerBtnDisabled = false;
            $scope.modalRegistration.show();
        }

        function showAdditional() {
            $scope.additionalData = !$scope.additionalData;
        }

        function closeRegistration(action) {
            $scope.modalRegistration.hide();

            var key = null;

            for (key in registrationData) {
                registrationData[key] = null;
            }

            key = null;

            for (key in $scope.registrationInputData) {
                if (key === 'username' || key === 'password' || key === 'confirmPassword') {
                    $scope.registrationInputData[key] = null;
                } else {
                    $scope.registrationInputData[key] = '';
                }
            }

            defaultLoginPlaceholders();
            defaultRegistrationPlaceholders();
            $scope.additionalData = false;

            if (action) {
                login();
            }
        }

        function doRegistration() {
            if (!validateRegistration()) {
                return;
            }

            registrationData.username = $scope.registrationInputData.username.trim();
            registrationData.password = $scope.registrationInputData.password.trim();
            registrationData.firstname = $scope.registrationInputData.firstname.trim();
            registrationData.lastname = $scope.registrationInputData.lastname.trim();
            registrationData.phone = $scope.registrationInputData.phone.trim();
            registrationData.street = $scope.registrationInputData.street.trim();
            registrationData.house = $scope.registrationInputData.house.trim();
            registrationData.entrance = $scope.registrationInputData.entrance.trim();
            registrationData.room = $scope.registrationInputData.room.trim();
            registrationData.floor = $scope.registrationInputData.floor.trim();

            $scope.registerBtnDisabled = true;

            DataService.registration(registrationData).then(
                function(value) {
                    if (value.success) {
                        closeRegistration(false);
                    } else {
                        $scope.registerBtnDisabled = false;
                    }
                },
                function(reason) {
                    DataService.showAlert('Эта ошибка никогда не произойдет');
                }
            );
        }

        function defaultLoginPlaceholders() {
            $scope.usernamePlaceholder = 'Введите ваш логин';
            $scope.passwordPlaceholder = 'Введите ваш пароль';

            $scope.usernamePlaceholderClass = null;
            $scope.passwordPlaceholderClass = null;
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

            $scope.confirmPasswordPlaceholderClass = null;
            $scope.firstnamePlaceholderClass = null;
            $scope.lastnamePlaceholderClass = null;
            $scope.phonePlaceholderClass = null;
            $scope.streetPlaceholderClass = null;
            $scope.housePlaceholderClass = null;
            $scope.entrancePlaceholderClass = null;
            $scope.roomPlaceholderClass = null;
            $scope.floorPlaceholderClass = null;
        }

        function validateLogin() {
            if ($scope.loginInputData.username === null || $scope.loginInputData.username.trim().length <= 0) {
                $scope.loginInputData.username = null;
                $scope.usernamePlaceholder = 'Вы не ввели логин';
                $scope.usernamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.loginInputData.username.trim().length > 20) {
                $scope.loginInputData.username = null;
                $scope.usernamePlaceholder = 'Слишком длинный логин';
                $scope.usernamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.loginInputData.password === null || $scope.loginInputData.password.trim().length <= 0) {
                $scope.loginInputData.password = null;
                $scope.passwordPlaceholder = 'Вы не ввели пароль';
                $scope.passwordPlaceholderClass = 'formError';

                return false;
            }

            return true;
        }

        function validateRegistration() {
            if ($scope.registrationInputData.username === null || $scope.registrationInputData.username.trim().length <= 0) {
                $scope.registrationInputData.username = null;
                $scope.usernamePlaceholder = 'Вы не ввели логин';
                $scope.usernamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.registrationInputData.username.trim().length > 20) {
                $scope.registrationInputData.username = null;
                $scope.usernamePlaceholder = 'Слишком длинный логин';
                $scope.usernamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.registrationInputData.password === null || $scope.registrationInputData.password.trim().length <= 0) {
                $scope.registrationInputData.password = null;
                $scope.passwordPlaceholder = 'Вы не ввели пароль';
                $scope.passwordPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.registrationInputData.confirmPassword === null || $scope.registrationInputData.confirmPassword.trim().length <= 0) {
                $scope.registrationInputData.confirmPassword = null;
                $scope.confirmPasswordPlaceholder = 'Подтвердите ваш пароль';
                $scope.confirmPasswordPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.registrationInputData.confirmPassword !== $scope.registrationInputData.password) {
                $scope.registrationInputData.confirmPassword = null;
                $scope.confirmPasswordPlaceholder = 'Пароли не совпадают';
                $scope.confirmPasswordPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.registrationInputData.firstname.trim().length > 20) {
                $scope.registrationInputData.firstname = '';
                $scope.firstnamePlaceholder = 'Слишком длинное имя';
                $scope.firstnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.registrationInputData.lastname.trim().length > 20) {
                $scope.registrationInputData.lastname = '';
                $scope.lastnamePlaceholder = 'Слишком длинная фамилия';
                $scope.lastnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.registrationInputData.street.trim().length > 40) {
                $scope.registrationInputData.street = '';
                $scope.streetPlaceholder = 'Слишком длинное название';
                $scope.streetPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.registrationInputData.house.trim().length > 0 && !isUInt($scope.registrationInputData.house)) {
                $scope.registrationInputData.house = '';
                $scope.housePlaceholder = 'Неверный формат';
                $scope.housePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.registrationInputData.room.trim().length > 0 && !isUInt($scope.registrationInputData.room)) {
                $scope.registrationInputData.room = '';
                $scope.roomPlaceholder = 'Неверный формат';
                $scope.roomPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.registrationInputData.entrance.trim().length > 0 && !isUInt($scope.registrationInputData.entrance)) {
                $scope.registrationInputData.entrance = '';
                $scope.entrancePlaceholder = 'Неверный формат';
                $scope.entrancePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.registrationInputData.floor.trim().length > 0 && !isUInt($scope.registrationInputData.floor)) {
                $scope.registrationInputData.floor = '';
                $scope.floorPlaceholder = 'Неверный формат';
                $scope.floorPlaceholderClass = 'formError';

                return false;
            }

            return true;
        }
    }

    function isUInt(str) {
        if (str.length <= 0) {
            return false;
        }

        num = +str;

        return isFinite(num) && ((num ^ 0) === num) && num >= 0 && num <= 255;
    }
})();