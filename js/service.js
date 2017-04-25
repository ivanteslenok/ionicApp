angular.module('starter.services', ['ionic'])

.service('DataService', function($http, $q, $ionicPopup, $ionicActionSheet) {
    var pizzas = [];
    var shoppingCart = [];

    var showAlert = function(title, text) {
        $ionicPopup.alert({
            title: title,
            template: text
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
                .error(function(data, status) {
                    showAlert('Ошибка сервера', status);
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

        addPizzaToCart: function(pizzaId) {
            var pizza = getPizza(pizzaId);

            var shoppingCartObj = {
                name: pizza.name,
                count: 1,
                size: ''
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
                    if (index === 0) {
                        console.log('1 clicked');
                        shoppingCartObj.size = 'sm';
                    }

                    if (index === 1) {
                        console.log('2 clicked');
                        shoppingCartObj.size = 'md';
                    }

                    if (index === 2) {
                        console.log('3 clicked');
                        shoppingCartObj.size = 'lg';
                    }

                    shoppingCart.push(shoppingCartObj);

                    // console.log(shoppingCart);

                    return true;
                }
            });
        }
    };
});