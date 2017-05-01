angular.module('starter.services', ['ionic'])

.service('DataService', function($http, $q, $ionicPopup, $ionicActionSheet) {
    var pizzas = [];
    var ingredients = [];
    var shoppingCart = [];

    var postConfig = {
        headers: {
            'Content-Type': 'json'
        }
    };

    var showAlert = function(title) {
        $ionicPopup.alert({
            title: title
        });
    };

    function getPizza(id) {
        for (var i = 0; i < pizzas.length; i++) {
            if (+pizzas[i].id === +id) {
                return pizzas[i];
            }
        }

        return null;
    }

    return {
        loadData: function() {
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
        },

        getAllPizzas: function() {
            return pizzas;
        },

        getPizza: getPizza,

        getCart: function() {
            return shoppingCart;
        },

        loadIngredients: function() {
            var defered = $q.defer();

            $http.get('https://ivanteslenok.000webhostapp.com/ingredients.php')
                .success(function(data) {
                    ingredients = data;
                    console.log(data);
                    defered.resolve(data);
                })
                .error(function() {
                    showAlert('Ошибка сервера');
                });

            return defered.promise;
        },

        getIngredients: function() {
            return ingredients;
        },

        registration: function(registrationData, closeMethod) {
            $http.post('https://ivanteslenok.000webhostapp.com/registration.php', registrationData)
                .success(function(data, status) {
                    showAlert(data);

                    // if (data.success) {
                    //     showAlert('Регистрация прошла успешно');
                    //     closeMethod();
                    // } else {
                    //     showAlert('Пользователь с таким логином уже существует');
                    // }
                })
                .error(function() {
                    showAlert('Ошибка сервера');
                });
        },

        addPizzaToCart: function(pizzaId) {
            var pizza = getPizza(pizzaId);

            var shoppingCartObj = {
                pizzaId: pizzaId,
                pizzaName: pizza.name,
                pizzaCount: 1,
                pizzaSize: ''
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
                            shoppingCartObj.pizzaSize = 'sm';
                            break;
                        case 1:
                            shoppingCartObj.pizzaSize = 'md';
                            break;
                        case 2:
                            shoppingCartObj.pizzaSize = 'lg';
                            break;
                    }

                    testCart = shoppingCart.find(function(elem) {
                        return elem.pizzaId === pizzaId && elem.pizzaSize === shoppingCartObj.pizzaSize;
                    });

                    if (!testCart) {
                        shoppingCart.push(shoppingCartObj);
                    } else {
                        testCart.pizzaCount++;
                    }

                    console.log(shoppingCart);

                    return true;
                }
            });
        }
    };
});