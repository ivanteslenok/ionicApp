(function() {
    'use strict';

    angular
        .module('starter.services', ['ionic'])
        .factory('DataService', DataService);

    function DataService($http, $q, $ionicPopup, $ionicActionSheet) {
        var pizzas = [];
        var ingredients = [];
        var shoppingCart = [];
        var isLoggedIn = false;

        var postConfig = {
            headers: {
                'Content-Type': 'json'
            }
        };

        var service = {
            showAlert: showAlert,
            getIsLoggedIn: getIsLoggedIn,
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

        function showAlert(title) {
            $ionicPopup.alert({
                title: title
            });
        }

        function getIsLoggedIn() {
            return isLoggedIn;
        }

        function loadData() {
            var defered = $q.defer();

            $http.get('https://ivanteslenok.000webhostapp.com/index.php')
                .success(function(data) {
                    pizzas = data;
                    //console.log(data);
                    defered.resolve(data);
                })
                .error(function() {
                    showAlert('Ошибка сервера');
                });

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

        function loadIngredients(hideLoading) {
            var defered = $q.defer();

            if (ingredients.length > 0) {
                defered.resolve(ingredients);

                return defered.promise;
            }

            $http.get('https://ivanteslenok.000webhostapp.com/ingredients.php')
                .success(function(data) {
                    ingredients = data;
                    console.log(data);
                    defered.resolve(data);
                })
                .error(function() {
                    hideLoading();
                    showAlert('Ошибка сервера');
                });

            return defered.promise;
        }

        function getIngredients() {
            return ingredients;
        }

        function login(loginData) {
            var defered = $q.defer();

            $http.post('https://ivanteslenok.000webhostapp.com/login.php', loginData)
                .success(function(data, status) {
                    defered.resolve(data);

                    if (data.success) {
                        //showAlert('Вход произведен успешно');
                        isLoggedIn = true;
                    } else if (data.username) {
                        showAlert('Неверный пароль');
                    } else {
                        showAlert('Пользователя с таким логином не существует, зарегестрируйтесь');
                    }
                })
                .error(function() {
                    showAlert('Ошибка сервера');
                });

            return defered.promise;
        }

        function registration(registrationData) {
            var defered = $q.defer();

            $http.post('https://ivanteslenok.000webhostapp.com/registration.php', registrationData)
                .success(function(data, status) {
                    defered.resolve(data);

                    if (data.success) {
                        //showAlert('Регистрация прошла успешно');
                    } else {
                        showAlert('Пользователь с таким логином уже существует');
                    }
                })
                .error(function() {
                    showAlert('Ошибка сервера');
                });

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

                    showAlert('Пицца "' + shoppingCartObj.pizzaName + ' ' + shoppingCartObj.pizzaSize + '" добавлена в корзину');

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

                    showAlert('Пицца добавлена в корзину');

                    console.log(shoppingCart);

                    return true;
                }
            });
        }
    }
})();