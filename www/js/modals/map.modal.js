angular.module('map.modal',['map','ngMessages','ui.bootstrap'])
    .service('mapModal',function(map,$uibModal,$rootScope){
        this.open = function(coordinates,readOnly){
            var newScope =$rootScope.$new();
            newScope.coordinates = coordinates;
            newScope.readOnly = readOnly;
            return $uibModal.open({
                templateUrl: 'templates/modals/map-modal.html',
                scope: newScope
            }).result;
        }
    })