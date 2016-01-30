angular.module('test.utils',[])
.service('testUtils',function($controller,$rootScope){
        this.controller = function(name,locals){
            locals.$scope = locals.$scope || $rootScope.$new();
            return {
                instance:$controller(name,locals),
                scope: locals.$scope
            };
        }
    })