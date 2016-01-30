angular.module('map.modal',['map','ngMessages','ratchet.modal'])
    .service('mapModal',function(map,$rootScope,rModal){
        this.open = function(coordinates,readOnly){
            var newScope =$rootScope.$new();
            newScope.coordinates = coordinates;
            newScope.readOnly = readOnly;
            return rModal.open({
                templateUrl: 'templates/modals/map-modal.html',
                scope: newScope
            }).result;
        }
    })