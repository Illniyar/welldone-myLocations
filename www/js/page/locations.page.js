angular.module('locations.page',['ui.router','ct.ui.router.extras','data','location.edit.modal','map.modal','ui.myTable'])
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
    .controller('locationsCtrl',function($scope,categories,locations,locationEditModal,$q,mapModal){
        $scope.locations = locations;
        function addCategoryToLocation(location){
            var category = null;
            for(var i=0;i <categories.length;i++){
                category = categories[i];
                if (category.id == location.category){
                    Object.defineProperty(location,'categoryName',{
                        get:function(){
                            return category.name;
                        },
                        enumerable:false,
                        readOnly:true
                    })
                    return;
                }
            }
        }
        locations.forEach(addCategoryToLocation)

        $scope.addNew = function(){
            locationEditModal.open(categories,null,function(newLocation){
                if (newLocation.name =='bad'){
                    return $q.reject('bad!')
                }
                return $scope.locations.post(newLocation).then(function(wrappedLocation){
                    $scope.locations.push(wrappedLocation);
                    addCategoryToLocation(wrappedLocation);
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
                $scope.currentChoice = undefined;
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
        $scope.showLocation = function(location){
            mapModal.open(location.coordinates,true);
        }
        $scope.tableOptions = {
            columns:[
                {key:'name',name:'Name',sort:true},
                {key:'categoryName',name:'Category',filter:true,groupBy:true}
            ],
            open: $scope.showLocation
        }
    })
