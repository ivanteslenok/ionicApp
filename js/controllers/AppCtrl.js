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

        // Меню ///////////////////////////////////////////////////////////////////////////////////////////////

        var isLoggedIn = false;

        function changeLoginOnRoom() {
            if (isLoggedIn) {
                $scope.menuLoginText = 'Личный кабинет';
                $scope.menuLoginAction = room;
            } else {
                $scope.menuLoginText = 'Войти/Регистрация';
                $scope.menuLoginAction = login;
            }
        }

        changeLoginOnRoom();

        // Вход ///////////////////////////////////////////////////////////////////////////////////////////////

        // Информация для входа
        var loginData = {
            username: null,
            password: null
        };

        $scope.loginInputData = {
            username: null,
            password: null
        };

        $scope.loginBtnDisabled = false;

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

        // Войти
        $scope.doLogin = doLogin;

        // Регистрация /////////////////////////////////////////////////////////////////////////////////////

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

        $scope.registerBtnDisabled = false;

        $scope.additionalData = false;

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

        // Зарегестрироваться
        $scope.doRegistration = doRegistration;

        // Личный кабинет ///////////////////////////////////////////////////////////////////////////

        // Модальное окно для Личного кабинета
        $ionicModal.fromTemplateUrl('templates/room.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalRoom = modal;
        });

        // Открытие модального окна Личного кабинета
        $scope.room = room;

        // Закрытие модального окна Личного кабинета
        $scope.closeRoom = closeRoom;

        // Выйти
        $scope.escapeRoom = escapeRoom;

        // Редактировать
        $scope.editRoom = editRoom;

        // Закрыть редактирование
        $scope.cancelEdit = cancelEdit;

        // Применит редактирование
        $scope.applyChanges = applyChanges;

        // Корзина /////////////////////////////////////////////////////////////////////////////////////     

        // Модальное окно для "Корзины"
        $ionicModal.fromTemplateUrl('templates/shopping-cart.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalShoppingCart = modal;
        });

        var totalPrice = 0;

        // Открыть "Корзину"
        $scope.shoppingCart = function() {
            $scope.cartItems = DataService.getCart();

            calcTotalPrice();

            $scope.modalShoppingCart.show();
        };

        // Закрыть "Корзину"
        $scope.closeShoppingCart = function() {
            $scope.modalShoppingCart.hide();
        };

        $scope.deleteItem = deleteItem;
        $scope.pizzaCountLess = pizzaCountLess;
        $scope.pizzaCountMore = pizzaCountMore;

        function calcTotalPrice() {
            totalPrice = 0;

            $scope.cartItems.forEach(function(elem) {
                totalPrice += +elem.pizzaPrice * +elem.pizzaCount;
            });

            if (totalPrice < 0) {
                totalPrice = 0;
            }

            $scope.cartTotalPrice = totalPrice.toFixed(2);
        }

        function pizzaCountLess(item) {
            $scope.cartItems[$scope.cartItems.indexOf(item)].pizzaCount--;

            if (item.pizzaCount <= 0) {
                deleteItem(item);
            }

            calcTotalPrice();
        }

        function pizzaCountMore(item) {
            $scope.cartItems[$scope.cartItems.indexOf(item)].pizzaCount++;

            if (item.pizzaCount > 10) {
                item.pizzaCount = 10;
                DataService.showAlert('Не более 10 одинаковых пицц!');
            }

            calcTotalPrice();
        }

        function deleteItem(item) {
            $scope.cartItems.splice($scope.cartItems.indexOf(item), 1);

            calcTotalPrice();
        }

        // Оформить заказ
        $scope.checkout = function() {
            order();
        };

        // Заказ ///////////////////////////////////////////////////////////////////////////////////////////////

        // Создание модального окна  Оформления заказа
        $ionicModal.fromTemplateUrl('templates/order.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalOrder = modal;
        });

        // Закрытие модального окна  Оформления заказа
        $scope.closeOrder = closeOrder;

        // Информация для заказа
        $scope.deliveryData = {
            firstname: null,
            lastname: null,
            phone: null,
            street: null,
            house: null,
            entrance: null,
            room: null,
            floor: null
        };

        $scope.pickupData = {
            firstname: null,
            lastname: null,
            phone: null
        };

        // Сделать покупку
        $scope.doPurchase = function() {
            if (!validateDelivery()) {
                return;
            }
        };

        // Functions ///////////////////////////////////////////////////////////////////////////////////////

        function login(register) {
            if (register) {
                DataService.showAlert('Регистрация прошла успешно', 'Теперь вы можете войти');
            }

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

            $scope.loginBtnDisabled = true;

            DataService.showLoading();

            loginData.username = $scope.loginInputData.username.trim();
            loginData.password = $scope.loginInputData.password.trim();

            DataService.login(loginData).then(
                function(value) {
                    if (value.success) {
                        DataService.loadUserInfo(loginData.username).then(
                            function(value) {
                                $scope.loginBtnDisabled = false;
                                DataService.hideLoading();
                                closeLogin();
                                isLoggedIn = true;
                                changeLoginOnRoom();
                                room(value);
                                DataService.showAlert('Вход произведен успешно');
                            },
                            function(reason) {
                                $scope.loginBtnDisabled = false;
                                DataService.hideLoading();
                            }
                        );
                    } else if (value.username) {
                        $scope.loginBtnDisabled = false;
                        DataService.hideLoading();
                        DataService.showAlert('Неверный пароль');
                    } else {
                        $scope.loginBtnDisabled = false;
                        DataService.hideLoading();
                        DataService.showAlert('Пользователя с таким логином не существует, зарегестрируйтесь');
                    }
                },
                function(reason) {
                    $scope.loginBtnDisabled = false;
                    DataService.hideLoading();
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

            $scope.registerBtnDisabled = true;

            DataService.showLoading();

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

            DataService.registration(registrationData).then(
                function(value) {
                    $scope.registerBtnDisabled = false;
                    DataService.hideLoading();

                    if (value.success) {
                        $scope.loginInputData.username = registrationData.username;
                        $scope.loginInputData.password = registrationData.password;

                        closeRegistration(false);

                        login(true);
                    }
                },
                function(reason) {
                    $scope.registerBtnDisabled = false;
                    DataService.hideLoading();
                }
            );
        }

        function room(userInfo) {
            $scope.userInfo = userInfo;

            // for (var key in $scope.userInfo) {
            //     if ($scope.userInfo[key] === '-' || $scope.userInfo[key] === '0') {
            //         $scope.userInfo[key] = 'Не указано';
            //     }
            // }

            $scope.isEdit = false;

            //$scope.userInfo = userInfo;
            $scope.modalRoom.show();
        }

        function closeRoom() {
            $scope.isEdit = false;
            $scope.modalRoom.hide();
        }

        function escapeRoom() {
            isLoggedIn = false;
            changeLoginOnRoom();
            closeRoom();
        }

        function editRoom(userInfo) {
            $scope.isEdit = true;
            $scope.applyChangesBtnDisabled = false;
            $scope.editUserInfo = {};

            for (var key in userInfo) {
                if (userInfo[key] === 'Не указано') {
                    $scope.editUserInfo[key] = '';
                } else {
                    $scope.editUserInfo[key] = userInfo[key];
                }
            }

            defaultUserInfoPlaceholders();
        }

        function cancelEdit() {
            $scope.isEdit = false;
        }

        function applyChanges(username, info) {
            if (!validateUserInfo()) {
                return;
            }

            $scope.applyChangesBtnDisabled = true;
            DataService.showLoading();

            DataService.updateUserInfo(username, info).then(
                function(value) {
                    if (value.success) {
                        DataService.loadUserInfo(info.username).then(
                            function(value) {
                                $scope.applyChangesBtnDisabled = false;
                                DataService.hideLoading();
                                userInfo = value;
                                closeRoom();
                                room(userInfo);
                                DataService.showAlert('Информация обновлена');
                            },
                            function(reason) {
                                $scope.applyChangesBtnDisabled = false;
                                DataService.hideLoading();
                            }
                        );
                    }
                },
                function(reason) {
                    $scope.applyChangesBtnDisabled = false;
                    DataService.hideLoading();
                }
            );

            $scope.isEdit = false;
        }

        // Открытие модального окна Оформления заказа
        function order() {
            $scope.modalOrder.show();
        }

        function closeOrder(action) {
            $scope.modalOrder.hide();
        }

        function defaultLoginPlaceholders() {
            $scope.usernamePlaceholder = 'Введите ваш логин';
            $scope.passwordPlaceholder = 'Введите ваш пароль';

            $scope.usernamePlaceholderClass = null;
            $scope.passwordPlaceholderClass = null;
        }

        function defaultUserInfoPlaceholders() {
            $scope.firstnamePlaceholder = 'Введите ваше имя';
            $scope.lastnamePlaceholder = 'Введите вашу фамилию';
            $scope.phonePlaceholder = 'Введите ваш телефон';
            $scope.streetPlaceholder = 'Улица';
            $scope.housePlaceholder = 'Дом';
            $scope.entrancePlaceholder = 'Подъезд';
            $scope.roomPlaceholder = 'Квартира';
            $scope.floorPlaceholder = 'Этаж';

            $scope.firstnamePlaceholderClass = null;
            $scope.lastnamePlaceholderClass = null;
            $scope.phonePlaceholderClass = null;
            $scope.streetPlaceholderClass = null;
            $scope.housePlaceholderClass = null;
            $scope.entrancePlaceholderClass = null;
            $scope.roomPlaceholderClass = null;
            $scope.floorPlaceholderClass = null;
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

        function validateUserInfo() {
            if ($scope.editUserInfo.firstname.trim().length > 20) {
                $scope.editUserInfo.firstname = '';
                $scope.firstnamePlaceholder = 'Слишком длинное имя';
                $scope.firstnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.editUserInfo.lastname.trim().length > 20) {
                $scope.editUserInfo.lastname = '';
                $scope.lastnamePlaceholder = 'Слишком длинная фамилия';
                $scope.lastnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.editUserInfo.street.trim().length > 40) {
                $scope.editUserInfo.street = '';
                $scope.streetPlaceholder = 'Слишком длинное название';
                $scope.streetPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.editUserInfo.house.trim().length > 0 && !isUInt($scope.editUserInfo.house)) {
                $scope.editUserInfo.house = '';
                $scope.housePlaceholder = 'Неверный формат';
                $scope.housePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.editUserInfo.room.trim().length > 0 && !isUInt($scope.editUserInfo.room)) {
                $scope.editUserInfo.room = '';
                $scope.roomPlaceholder = 'Неверный формат';
                $scope.roomPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.editUserInfo.entrance.trim().length > 0 && !isUInt($scope.editUserInfo.entrance)) {
                $scope.editUserInfo.entrance = '';
                $scope.entrancePlaceholder = 'Неверный формат';
                $scope.entrancePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.editUserInfo.floor.trim().length > 0 && !isUInt($scope.editUserInfo.floor)) {
                $scope.editUserInfo.floor = '';
                $scope.floorPlaceholder = 'Неверный формат';
                $scope.floorPlaceholderClass = 'formError';

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

    function validateDelivery() {

    }

    function validatePickup() {

    }

    function isUInt(str) {
        if (str.length <= 0) {
            return false;
        }

        var num = +str;

        return isFinite(num) && ((num ^ 0) === num) && num >= 0 && num <= 255;
    }
})();