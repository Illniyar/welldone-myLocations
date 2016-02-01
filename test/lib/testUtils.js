angular.module('test.utils',[])
.service('testUtils',function($controller,$rootScope,$compile){
        this.controller = function(name,locals){
            locals.$scope = locals.$scope || $rootScope.$new();
            return {
                instance:$controller(name,locals),
                scope: locals.$scope
            };
        }
        this.compile = function(template,options){
            var scope,rootDir;
            options = options || {};
            if (options.scope && options.scope.$new) {
                scope = options.scope;
            } else {
                scope = $rootScope.$new();
                angular.extend(scope,options.scope || {});
            }
            var rootDir = $compile(template)(scope);
            scope.$apply();
            return {
                scope:scope,
                root:rootDir,
                find:function(selector){
                    return angular.element(rootDir[0].querySelectorAll(selector));
                },
                clickOn: function(el){
                    if (angular.isString(el)){
                        el = rootDir[0].querySelectorAll(el);
                    }
                    if (el.fireEvent) {
                        el.fireEvent('onclick');
                    } else {
                        var evObj = document.createEvent('Events');
                        evObj.initEvent('click', true, false);
                        el.dispatchEvent(evObj);
                    }
                }
            }
        }
    })