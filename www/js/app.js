"use strict";
angular.module('myLocations',['ui.router','ngTouch','mobile.utils','map','root.page'])
    .config(function RouteConfig(rootPageRouteProvider,$stateProvider,$urlRouterProvider){
        rootPageRouteProvider.load('root');
        $urlRouterProvider.otherwise('/category');
    })
    .config(function ServiceConfig(mapProvider){
        mapProvider.load('AIzaSyCCpDsVlaan5P5-pKZmSN1Oao0f6892kfo');
    })
