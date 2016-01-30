angular.module('location.edit.modal',['map','map.modal','ratchet.modal'])
    .service('locationEditModal',function($q,$rootScope,rModal){
        this.open = function(categories,location,onEdit){
            var newScope = $rootScope.$new();
            newScope.categories = categories;
            newScope.location = location;
            newScope.onEdit = onEdit || function(){return $q.resolve()}
            return rModal.open({
                templateUrl: 'templates/modals/location-edit-modal.html',
                controller: 'locationEditCtrl',
                scope: newScope
            }).result;
        }
    })
    .controller('locationEditCtrl',function($scope,map,mapModal){
        $scope.updateCoords = function(){
            map.geocode($scope.location.address).then(function(coords){
                if (coords){
                    $scope.location.coordinates = coords;
                }
            })
        }
        $scope.chooseCoords = function(){
            var x = mapModal.open($scope.location.coordinates);
            x.then(function(newCoordinates){
                $scope.location.coordinates = newCoordinates;
            })
        }
        $scope.save = function(){
            $scope.onEdit($scope.location).then(function(){
                $scope.$close($scope.location);
            })
        }
    })
    .filter('coordinates',function(){
        return function(value){
            return value? (value.lat.toFixed(2) + ' ; ' + value.lng.toFixed(2)) : "";
        }
    })