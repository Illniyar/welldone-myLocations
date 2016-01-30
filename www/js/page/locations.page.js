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
        $scope.toggleOrder = function(){
            $scope.orderDescending = !$scope.orderDescending;
        }
        $scope.toggleGroupBy = function(){
            $scope.groupByCategory = !$scope.groupByCategory;
        }
        $scope.toggleCategoryFilter = function(){
            $scope.showCategoryFilter = !$scope.showCategoryFilter;
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
    .filter('locationOrder',function($filter){
        var categoryName = $filter('categoryName');
        return function(locations,sortDescending,groupByCategory,categoryFilter){
            if (categoryFilter){
                locations = locations.filter(function(location){
                    var name = categoryName(location.category);
                    return name.indexOf(categoryFilter) >=0;
                })
            }
            if (!groupByCategory){
                return locations.sort(function(a,b){
                    return sortDescending? a.name > b.name : b.name > a.name;
                })
            } else {
                return locations.sort(function(a,b){
                    if (a.category == b.category){
                        return sortDescending? a.name > b.name : b.name > a.name;
                    }
                    return sortDescending? a.category > b.category : b.category > a.category;
                })
            }
        }
    })
