"use strict";
angular.module('localStorage',[])
    .service('localStorage',function(){
        this.get = function(key){
            var res = window.localStorage.getItem(key);
            if (!res || res == 'undefined'){
                return undefined;
            } else {
                return JSON.parse(res);
            }
        }
        this.set = function(key,obj){
            if (obj === undefined) {
                window.localStorage.setItem(key,undefined);
            } else {
                window.localStorage.setItem(key,JSON.stringify(obj));
            }
        }
        this.delete = function(key){
            window.localStorage.removeItem(key);
        }
    })