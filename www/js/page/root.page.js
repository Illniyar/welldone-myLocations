angular.module('root.page',['ui.router','categories.page','locations.page'])
    .provider('rootPageRoute',function($stateProvider,categoriesPageRouteProvider,locationsPageRouteProvider){
        this.load = function(rootName){
            $stateProvider.state(rootName,{
                abstract:true,
                templateUrl:'templates/pages/root.html',
                controller:'rootCtrl'
            })

            categoriesPageRouteProvider.load(rootName);
            locationsPageRouteProvider.load(rootName);

        }
        this.$get = function(){};
    })
    .controller('rootCtrl',function($scope,$state){
        $scope.$state =$state;
    })