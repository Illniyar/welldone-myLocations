angular.module('locations.page',['ui.router','ct.ui.router.extras','data','location.edit.modal'])
    .provider('locationsPageRoute',function($stateProvider){
        this.load = function(parent){
            $stateProvider.state(parent +'.locations',{
                url:'/location',
                views: {
                    'locations':{
                        templateUrl:'templates/pages/locations.html',
                        controller:'locationsCtrl'
                    }
                },
                resolve: {
                    categories:function(data){
                        return data.getCategories();
                    },
                    locations:function(data){
                        return data.getLocations();
                    }
                },
                deepStateRedirect: true,
                sticky: true
            })
        }
        this.$get = function(){};
    })
    .controller('locationsCtrl',function($scope,categories,locations,locationEditModal,$q){
        $scope.locations = locations;

        $scope.addNew = function(){
            locationEditModal.open(categories,{},function(newLocation){
                if (newLocation.name =='bad'){
                    return $q.reject('bad!')
                }
                return $scope.locations.post(newLocation).then(function(wrappedLocation){
                    $scope.locations.push(wrappedLocation);
                })
            });
        }
        $scope.removeLocation = function(location){
            location.remove().then(function(){
                for (var i=0; i < $scope.locations.length;i++) {
                    if ($scope.locations[i] == location) {
                        $scope.locations.splice(i,1);
                    }
                }
            })
        }
        $scope.editLocation = function(location){
            locationEditModal.open(categories,angular.copy(location),function(updatedLocation){
                if (!angular.equals(location,updatedLocation)) {
                    var rollbackLocation = angular.copy(location);
                    angular.extend(location,updatedLocation);
                    return location.put().catch(function rollback(e){
                        angular.extend(location,rollbackLocation);
                        return $q.reject(e);
                    })
                } else {
                    return $q.resolve(location);
                }
            });
        }
    })
    .filter('categoryName',function(data){
        var categories;
        data.getCategories().then(function(res){
            categories = res;
        });
        return function(categoryId){
            for (var i=0; i <categories.length;i++) {
                if (categories[i].id == categoryId){
                    return categories[i].name;
                }
            }
            return '';
        }

    })
