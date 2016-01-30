"use strict";
angular.module('myLocations',['ui.router','ngTouch','map','root.page'])
    .config(function RouteConfig(rootPageRouteProvider,$stateProvider,$urlRouterProvider){
        rootPageRouteProvider.load('root');
        $urlRouterProvider.otherwise('/location');
    })
    .config(function ServiceConfig(mapProvider){
        mapProvider.load('AIzaSyCCpDsVlaan5P5-pKZmSN1Oao0f6892kfo');
    })
