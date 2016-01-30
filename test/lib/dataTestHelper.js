angular.module('data.test.helper',[])
    .service('dataTestHelper',function($q){
        this.mockCollection = function(arr){
            var collection = arr.map(function(obj){
                Object.defineProperties(obj,{
                    put: {
                        value:function(){
                            obj = JSON.parse(JSON.stringify(obj));
                            return $q.resolve(obj)
                        },
                        enumerable:false
                    }
                })
                return obj;
            })
            Object.defineProperty(collection,'post',{
                value:function(obj){
                    obj = JSON.parse(JSON.stringify(obj));
                    obj.id = Math.random()* 100000;
                    return $q.resolve(obj);
                },
                enumerable:false
            });
            return collection;
        }
    })
