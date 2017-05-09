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

        var isLoggedIn;

        if (window.localStorage.getItem('isLoggedIn') !== null) {
            isLoggedIn = window.localStorage.getItem('isLoggedIn') === '0' ? false : true;
        } else {
            isLoggedIn = false;
        }

        var userInfo = {};

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

        var activeClass = '';
        var unActiveClass = 'button-outline';

        $scope.deliveryClass = activeClass;
        $scope.pickupClass = unActiveClass;
        $scope.isDelivery = true;
        $scope.doPurchase = doDelivery;

        $scope.delivery = function() {
            defaultUserInfoPlaceholders();
            $scope.isDelivery = true;
            $scope.doPurchase = doDelivery;
            $scope.deliveryClass = activeClass;
            $scope.pickupClass = unActiveClass;
        };

        $scope.pickup = function() {
            defaultUserInfoPlaceholders();
            $scope.isDelivery = false;
            $scope.doPurchase = doPickup;
            $scope.deliveryClass = unActiveClass;
            $scope.pickupClass = activeClass;
        };

        function doDelivery() {
            if (!validateDelivery()) {
                return;
            }

            // defaultUserInfoPlaceholders();

            // for (var key in $scope.deliveryData) {
            //     $scope.deliveryData[key] = null;
            // }

            // DataService.showAlert('Заказ оформлен');

            closeOrder(true);
        }

        function doPickup() {
            if (!validatePickup()) {
                return;
            }

            // defaultUserInfoPlaceholders();

            // for (var key in $scope.pickupData) {
            //     $scope.pickupData[key] = null;
            // }

            // DataService.showAlert('Заказ оформлен');

            closeOrder(true);
        }

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
                        $scope.loginBtnDisabled = false;
                        DataService.hideLoading();
                        closeLogin();
                        window.localStorage.setItem('isLoggedIn', '1');
                        window.localStorage.setItem('username', loginData.username);
                        isLoggedIn = true;
                        changeLoginOnRoom();
                        room(loginData.username, true);
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

        function room(username, isEnter, isChanged) {
            var roomUser = username || window.localStorage.getItem('username');
            $scope.isEdit = false;

            if (isEnter) {
                DataService.showAlert('Вход произведен успешно');
            }

            if (isChanged) {
                DataService.showAlert('Информация обновлена');
            }

            DataService.showLoading();

            DataService.loadUserInfo(roomUser).then(
                function(value) {
                    $scope.userInfo = value;

                    for (var key in $scope.userInfo) {
                        if ($scope.userInfo[key] === '-' || $scope.userInfo[key] === '0') {
                            $scope.userInfo[key] = 'Не указано';
                        }
                    }

                    DataService.hideLoading();

                    if (!isChanged) {
                        $scope.modalRoom.show();
                    }
                },
                function(reason) {
                    DataService.hideLoading();
                }
            );
        }

        function closeRoom() {
            $scope.isEdit = false;
            $scope.modalRoom.hide();
        }

        function escapeRoom() {
            window.localStorage.setItem('isLoggedIn', '0');
            window.localStorage.removeItem('username');
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

        function applyChanges(userInfo) {
            if (!validateUserInfo()) {
                return;
            }

            $scope.applyChangesBtnDisabled = true;
            DataService.showLoading();

            DataService.updateUserInfo(userInfo).then(
                function(value) {
                    if (value.success) {
                        $scope.applyChangesBtnDisabled = false;
                        DataService.hideLoading();
                        $scope.isEdit = false;
                        window.localStorage.setItem('username', userInfo.username);
                        room(false, false, true);
                    }
                },
                function(reason) {
                    $scope.applyChangesBtnDisabled = false;
                    DataService.hideLoading();
                }
            );
        }

        // Открытие модального окна Оформления заказа
        function order() {
            if (isLoggedIn) {
                DataService.showLoading();
                var username = window.localStorage.getItem('username');

                DataService.loadUserInfo(username).then(
                    function(value) {
                        var key;

                        for (key in $scope.deliveryData) {
                            $scope.deliveryData[key] = value[key];
                        }

                        key = null;

                        for (key in $scope.pickupData) {
                            $scope.pickupData[key] = value[key];
                        }

                        DataService.hideLoading();
                    },
                    function(reason) {
                        DataService.hideLoading();
                    }
                );
            }

            defaultUserInfoPlaceholders();
            $scope.modalOrder.show();
        }

        function closeOrder(action) {
            $scope.modalOrder.hide();

            if (action) {
                DataService.showAlert('Заказ оформлен');
            }

            defaultUserInfoPlaceholders();

            var key;

            for (key in $scope.deliveryData) {
                $scope.deliveryData[key] = null;
            }

            key = null;

            for (key in $scope.pickupData) {
                $scope.pickupData[key] = null;
            }
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
            $scope.phonePlaceholder = 'код страны (код оператора) номер';
            $scope.streetPlaceholder = 'Название улицы';
            $scope.housePlaceholder = '№ дома';
            $scope.entrancePlaceholder = '№ подъезда';
            $scope.roomPlaceholder = '№ квартиры';
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
            $scope.phonePlaceholder = 'код страны (код оператора) номер';
            $scope.streetPlaceholder = 'Название улицы';
            $scope.housePlaceholder = '№ дома';
            $scope.entrancePlaceholder = '№ подъезда';
            $scope.roomPlaceholder = '№ квартиры';
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

            if ($scope.editUserInfo.phone.length > 0) {
                if (roomForm.phone.className.indexOf('ng-invalid') !== -1) {
                    $scope.editUserInfo.phone = '';
                    $scope.phonePlaceholder = 'Неверный формат';
                    $scope.phonePlaceholderClass = 'formError';

                    return false;
                }
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

            if ($scope.registrationInputData.phone.length > 0) {
                if (registerForm.phone.className.indexOf('ng-invalid') !== -1) {
                    $scope.registrationInputData.phone = '';
                    $scope.phonePlaceholder = 'Неверный формат';
                    $scope.phonePlaceholderClass = 'formError';

                    return false;
                }
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

        function validateDelivery() {
            if ($scope.deliveryData.firstname === null || $scope.deliveryData.firstname.trim().length <= 0) {
                $scope.deliveryData.firstname = null;
                $scope.firstnamePlaceholder = 'Вы не ввели имя';
                $scope.firstnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.firstname.trim().length > 20) {
                $scope.deliveryData.firstname = null;
                $scope.firstnamePlaceholder = 'Слишком длинное имя';
                $scope.firstnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.lastname === null || $scope.deliveryData.lastname.trim().length <= 0) {
                $scope.deliveryData.lastname = null;
                $scope.lastnamePlaceholder = 'Вы не ввели фамилию';
                $scope.lastnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.lastname.trim().length > 20) {
                $scope.deliveryData.lastname = null;
                $scope.lastnamePlaceholder = 'Слишком длинная фамилия';
                $scope.lastnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.phone === null || $scope.deliveryData.phone.trim().length <= 0) {
                $scope.deliveryData.phone = null;
                $scope.phonePlaceholder = 'Вы не ввели номер телефона';
                $scope.phonePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.phone.length > 0) {
                if (deliveryForm.phone.className.indexOf('ng-invalid') !== -1) {
                    $scope.deliveryData.phone = null;
                    $scope.phonePlaceholder = 'Неверный формат';
                    $scope.phonePlaceholderClass = 'formError';

                    return false;
                }
            }

            if ($scope.deliveryData.street === null || $scope.deliveryData.street.trim().length <= 0) {
                $scope.deliveryData.street = null;
                $scope.streetPlaceholder = 'Вы не ввели название улицы';
                $scope.streetPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.street.trim().length > 40) {
                $scope.deliveryData.street = null;
                $scope.streetPlaceholder = 'Слишком длинное название';
                $scope.streetPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.house === null || $scope.deliveryData.house.trim().length <= 0) {
                $scope.deliveryData.house = null;
                $scope.housePlaceholder = 'Вы не ввели № дома';
                $scope.housePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.house.trim().length > 0 && !isUInt($scope.deliveryData.house)) {
                $scope.deliveryData.house = null;
                $scope.housePlaceholder = 'Неверный формат';
                $scope.housePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.room === null || $scope.deliveryData.room.trim().length <= 0) {
                $scope.deliveryData.room = null;
                $scope.roomPlaceholder = 'Вы не ввели № квартиры';
                $scope.roomPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.room.trim().length > 0 && !isUInt($scope.deliveryData.room)) {
                $scope.deliveryData.room = null;
                $scope.roomPlaceholder = 'Неверный формат';
                $scope.roomPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.entrance === null || $scope.deliveryData.entrance.trim().length <= 0) {
                $scope.deliveryData.entrance = null;
                $scope.entrancePlaceholder = 'Вы не ввели № подъезда';
                $scope.entrancePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.entrance.trim().length > 0 && !isUInt($scope.deliveryData.entrance)) {
                $scope.deliveryData.entrance = null;
                $scope.entrancePlaceholder = 'Неверный формат';
                $scope.entrancePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.floor === null || $scope.deliveryData.floor.trim().length <= 0) {
                $scope.deliveryData.floor = null;
                $scope.floorPlaceholder = 'Вы не ввели этаж';
                $scope.floorPlaceholderClass = 'formError';

                return false;
            }

            if ($scope.deliveryData.floor.trim().length > 0 && !isUInt($scope.deliveryData.floor)) {
                $scope.deliveryData.floor = null;
                $scope.floorPlaceholder = 'Неверный формат';
                $scope.floorPlaceholderClass = 'formError';

                return false;
            }

            return true;
        }

        function validatePickup() {
            if ($scope.pickupData.firstname === null || $scope.pickupData.firstname.trim().length <= 0) {
                $scope.pickupData.firstname = null;
                $scope.firstnamePlaceholder = 'Вы не ввели имя';
                $scope.firstnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.pickupData.firstname.trim().length > 20) {
                $scope.pickupData.firstname = null;
                $scope.firstnamePlaceholder = 'Слишком длинное имя';
                $scope.firstnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.pickupData.lastname === null || $scope.pickupData.lastname.trim().length <= 0) {
                $scope.pickupData.lastname = null;
                $scope.lastnamePlaceholder = 'Вы не ввели фамилию';
                $scope.lastnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.pickupData.lastname.trim().length > 20) {
                $scope.pickupData.lastname = null;
                $scope.lastnamePlaceholder = 'Слишком длинная фамилия';
                $scope.lastnamePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.pickupData.phone === null || $scope.pickupData.phone.trim().length <= 0) {
                $scope.pickupData.phone = null;
                $scope.phonePlaceholder = 'Вы не ввели номер телефона';
                $scope.phonePlaceholderClass = 'formError';

                return false;
            }

            if ($scope.pickupData.phone.length > 0) {
                if (pickupForm.phone.className.indexOf('ng-invalid') !== -1) {
                    $scope.pickupData.phone = null;
                    $scope.phonePlaceholder = 'Неверный формат';
                    $scope.phonePlaceholderClass = 'formError';

                    return false;
                }
            }

            return true;
        }
    }

    function isUInt(str) {
        if (str.length <= 0) {
            return false;
        }

        var num = +str;

        return isFinite(num) && ((num ^ 0) === num) && num >= 0 && num <= 255;
    }
})();