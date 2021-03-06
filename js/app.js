// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
(function() {
    'use strict';

    angular
        .module('starter', ['ionic', 'starter.controllers', 'starter.services'])
        .run(run)
        .config(config);

    function run($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.create-pizza', {
            url: '/create-pizza',
            views: {
                'menuContent': {
                    templateUrl: 'templates/create-pizza.html',
                    controller: 'PizzaCreatorCtrl'
                }
            }
        })

        .state('app.pizzas', {
            url: '/pizzas',
            views: {
                'menuContent': {
                    templateUrl: 'templates/pizzas.html',
                    controller: 'PizzasCtrl'
                }
            }
        })

        .state('app.info', {
            url: '/info',
            views: {
                'menuContent': {
                    templateUrl: 'templates/info.html'
                }
            }
        })

        .state('app.contacts', {
            url: '/contacts',
            views: {
                'menuContent': {
                    templateUrl: 'templates/contacts.html'
                }
            }
        })

        .state('app.single', {
            url: '/pizzas/:pizzaId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/pizza.html',
                    controller: 'PizzaCtrl'
                }
            }
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/pizzas');
    }
})();