(function() {
    'use strict';

    angular
        .module('starter.services', ['ionic', 'ngCordova'])
        .factory('DataService', DataService);

    function DataService($http, $q, $ionicPopup, $ionicActionSheet, $cordovaNetwork, $rootScope, $ionicLoading) {
        var isOnline = true;

        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
            isOnline = false;
        });

        $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
            isOnline = true;
        });

        var pizzas = [];
        var ingredients = [];
        var shoppingCart = [];

        var service = {
            showAlert: showAlert,
            showLoading: showLoading,
            hideLoading: hideLoading,
            loadUserInfo: loadUserInfo,
            updateUserInfo: updateUserInfo,
            loadData: loadData,
            getAllPizzas: getAllPizzas,
            getPizza: getPizza,
            getCart: getCart,
            loadIngredients: loadIngredients,
            getIngredients: getIngredients,
            login: login,
            registration: registration,
            addPizzaToCart: addPizzaToCart,
            addCustomPizzaToCart: addCustomPizzaToCart
        };

        return service;

        // Functions

        function showAlert(title, subtitle) {
            $ionicPopup.alert({
                title: title,
                subTitle: subtitle
            });
        }

        function showLoading() {
            $ionicLoading.show({
                template: 'Загрузка...'
            });
        }

        function hideLoading() {
            $ionicLoading.hide();
        }

        function loadData() {
            var defered = $q.defer();

            if (isOnline) {
                $http.get('http://ivanteslenok.esy.es/index.php')
                    .success(function(data) {
                        pizzas = data;
                        //console.log(data);
                        defered.resolve(data);
                    })
                    .error(function() {
                        showAlert('Ошибка сервера');
                        defered.reject();
                    });
            } else {
                showAlert('Отсутствует подключение к сети!');
                defered.reject();
            }

            return defered.promise;
        }

        function getAllPizzas() {
            return pizzas;
        }

        function getPizza(id) {
            for (var i = 0; i < pizzas.length; i++) {
                if (+pizzas[i].id === +id) {
                    return pizzas[i];
                }
            }

            return null;
        }

        function getCart() {
            return shoppingCart;
        }

        function loadIngredients() {
            var defered = $q.defer();

            if (isOnline) {
                if (ingredients.length > 0) {
                    defered.resolve(ingredients);

                    return defered.promise;
                }

                $http.get('http://ivanteslenok.esy.es/ingredients.php')
                    .success(function(data) {
                        ingredients = data;
                        //console.log(data);
                        defered.resolve(data);
                    })
                    .error(function() {
                        showAlert('Ошибка сервера');
                        defered.reject();
                    });
            } else {
                showAlert('Отсутствует подключение к сети!');
                defered.reject();
            }

            return defered.promise;
        }

        function getIngredients() {
            return ingredients;
        }

        function login(loginData) {
            var defered = $q.defer();

            if (isOnline) {
                $http.post('http://ivanteslenok.esy.es/login.php', loginData)
                    .success(function(data, status) {
                        defered.resolve(data);
                    })
                    .error(function() {
                        showAlert('Ошибка сервера');
                        defered.reject();
                    });
            } else {
                showAlert('Отсутствует подключение к сети!');
                defered.reject();
            }

            return defered.promise;
        }

        function loadUserInfo(username) {
            var defered = $q.defer();

            if (isOnline) {
                $http.get('http://ivanteslenok.esy.es/userInfo.php?username=' + username)
                    .success(function(data) {
                        defered.resolve(data);
                    })
                    .error(function() {
                        showAlert('Ошибка сервера');
                        defered.reject();
                    });
            } else {
                showAlert('Отсутствует подключение к сети!');
                defered.reject();
            }

            return defered.promise;
        }

        function updateUserInfo(userInfo) {
            var defered = $q.defer();

            if (isOnline) {
                $http.post('http://ivanteslenok.esy.es/updateUser.php', userInfo)
                    .success(function(data, status) {
                        defered.resolve(data);
                    })
                    .error(function() {
                        showAlert('Ошибка сервера');
                        defered.reject();
                    });
            } else {
                showAlert('Отсутствует подключение к сети!');
                defered.reject();
            }

            return defered.promise;
        }

        function registration(registrationData) {
            var defered = $q.defer();

            if (isOnline) {
                $http.post('http://ivanteslenok.esy.es/registration.php', registrationData)
                    .success(function(data, status) {
                        defered.resolve(data);

                        if (!data.success) {
                            showAlert('Пользователь с таким логином уже существует');
                        }
                    })
                    .error(function() {
                        showAlert('Ошибка сервера');
                        defered.reject();
                    });
            } else {
                showAlert('Отсутствует подключение к сети!');
                defered.reject();
            }

            return defered.promise;
        }

        function addPizzaToCart(pizzaId) {
            var pizza = getPizza(pizzaId);

            var shoppingCartObj = {
                pizzaId: pizzaId,
                pizzaName: pizza.name,
                pizzaCount: 1,
                pizzaSize: '',
                ingredients: pizza.ingredients,
                pizzaPrice: 0,
                isCustom: false
            };

            $ionicActionSheet.show({
                titleText: 'Выберите размер',

                buttons: [
                    { text: 'Маленькая - ' + pizza.smSizePrice + 'р.' },
                    { text: 'Средняя - ' + pizza.mdSizePrice + 'р.' },
                    { text: 'Большая - ' + pizza.lgSizePrice + 'р.' }
                ],

                cancelText: 'Отмена',

                buttonClicked: function(index) {
                    switch (index) {
                        case 0:
                            shoppingCartObj.pizzaSize = 'Маленькая';
                            shoppingCartObj.pizzaPrice = pizza.smSizePrice;
                            break;
                        case 1:
                            shoppingCartObj.pizzaSize = 'Средняя';
                            shoppingCartObj.pizzaPrice = pizza.mdSizePrice;
                            break;
                        case 2:
                            shoppingCartObj.pizzaSize = 'Большая';
                            shoppingCartObj.pizzaPrice = pizza.lgSizePrice;
                            break;
                    }

                    // var testCart = shoppingCart.find(function(elem) {
                    //     return elem.pizzaId === pizzaId && elem.pizzaSize === shoppingCartObj.pizzaSize;
                    // });

                    var testCart;

                    for (var i = 0; i < shoppingCart.length; i++) {
                        if (shoppingCart[i].pizzaId === shoppingCartObj.pizzaId && shoppingCart[i].pizzaSize === shoppingCartObj.pizzaSize) {
                            testCart = shoppingCart[i];
                        }
                    }

                    if (!testCart) {
                        shoppingCart.push(shoppingCartObj);
                    } else {
                        testCart.pizzaCount++;
                    }

                    showAlert('Пицца "' + shoppingCartObj.pizzaName + ' ' + shoppingCartObj.pizzaSize + '" добавлена в корзину', 'Количество заказываемых пицц может быть изменено в корзине');

                    console.log(shoppingCart);

                    return true;
                }
            });
        }

        function addCustomPizzaToCart(ingredients, totalPrice) {
            var customId = '';
            var ingredientsNames = [];

            ingredients.forEach(function(elem) {
                customId += elem.id;
                ingredientsNames.push(elem.name);
            });


            var shoppingCartObj = {
                pizzaId: +customId,
                pizzaName: 'custom pizza (' + customId + ')',
                pizzaCount: 1,
                pizzaSize: '',
                ingredients: ingredientsNames.join(', '),
                pizzaPrice: 0,
                isCustom: true
            };

            $ionicActionSheet.show({
                titleText: 'Выберите размер',

                buttons: [
                    { text: 'Маленькая - ' + (totalPrice * 0.8).toFixed(2) + 'р.' },
                    { text: 'Средняя - ' + totalPrice + 'р.' },
                    { text: 'Большая - ' + (totalPrice * 1.2).toFixed(2) + 'р.' }
                ],

                cancelText: 'Отмена',

                buttonClicked: function(index) {
                    switch (index) {
                        case 0:
                            shoppingCartObj.pizzaSize = 'Маленькая';
                            shoppingCartObj.pizzaPrice = (totalPrice * 0.8).toFixed(2);
                            break;
                        case 1:
                            shoppingCartObj.pizzaSize = 'Средняя';
                            shoppingCartObj.pizzaPrice = totalPrice;
                            break;
                        case 2:
                            shoppingCartObj.pizzaSize = 'Большая';
                            shoppingCartObj.pizzaPrice = (totalPrice * 1.2).toFixed(2);
                            break;
                    }

                    // var testCart = shoppingCart.find(function(elem) {
                    //     return elem.pizzaId === +customId && elem.pizzaSize === shoppingCartObj.pizzaSize;
                    // });

                    var testCart;

                    for (var i = 0; i < shoppingCart.length; i++) {
                        if (shoppingCart[i].pizzaId === shoppingCartObj.pizzaId && shoppingCart[i].pizzaSize === shoppingCartObj.pizzaSize) {
                            testCart = shoppingCart[i];
                        }
                    }

                    if (!testCart) {
                        shoppingCart.push(shoppingCartObj);
                    } else {
                        testCart.pizzaCount++;
                    }

                    showAlert('Пицца добавлена в корзину', 'Количество заказываемых пицц может быть изменено в корзине');

                    console.log(shoppingCart);

                    return true;
                }
            });
        }
    }
})();