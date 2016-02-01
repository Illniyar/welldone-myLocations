"use strict";
angular.module('localStorageCRUD',['localStorage'])
    /**
     * localStorageCRUD service
     *
     * Simulates Restangular API based on LocalStorage.
     */
    .service('localStorageCRUD',function($q,$timeout,localStorage){

        /**
         * transforms a synchronous response to an async response with random delay
         */
        function delayResult(toReturn){
            return $timeout(
                function(){
                    return toReturn
                },
                200 + Math.random()*300 //simulate call to external resource
            )
        }
        function reject(err){
            return delayResult($q.reject(err));
        }
        function Collection(collectionKey){
            var self = this;
            var list = localStorage.get(collectionKey);
            if (!list){
                list = [];
            };
            this._maxId = 0;
            list.forEach(function(item){
                self._maxId = Math.max(self._maxId,item.id);
            })
            Object.defineProperties(this,{
                "_collectionKey":{
                    enumerable:false,
                    writable:false,
                    value:collectionKey
                },
                "_list":{
                    enumerable:false,
                    writable:false,
                    value:list
                }
            })
        }
        Collection.prototype.getList = function(){
            var $object = this._getEnhancedItemArray()
            var promise =delayResult($object);
            promise.$object =$object;
            return promise;
        }
        Collection.prototype.post = function(obj){
            obj = angular.copy(obj); //we should not modify obj in place
            if (obj.id === undefined || obj.id === null){
                this._maxId = obj.id = this._maxId + 1;
            } else {
                this._maxId = Math.max(obj.id,this._maxId);
            }
            this._list.push(obj);
            localStorage.set(this._collectionKey,this._list);
            return delayResult(new Item(this,obj.id,obj));

        }
        Collection.prototype._getEnhancedItemArray = function(){
            var self = this;
            var wrappedList = this._list.map(function(item){
                return new Item(self,item.id,item);
            })
            wrappedList.post = function(obj){
                return self.post(obj)
            }
            return wrappedList;
        }
        function Item(collection,itemId,raw){
            Object.defineProperties(this,{
                "_collection":{
                    enumerable:false,
                    writable:false,
                    value:collection
                },
                "_itemId":{
                    enumerable:false,
                    writable:false,
                    value:itemId
                },
                "_raw":{
                    enumerable:false,
                    writable:false,
                    value:raw
                }
            })
            angular.extend(this,raw);
            (extensions[collection._collectionKey] || []).forEach(function(extension){
                extension(this);
            }.bind(this))
        }
        Item.prototype.get = function(){
            var list = localStorage.get(this.collectionKey);
            for (var i=0; i < list.length;i++){
                if (list[i].id == this._itemId){
                    return delayResult(list[i]);
                }
            }
            return reject(new Error('could not find obj with Id ' + this.itemId));
        }
        Item.prototype.put = function(){
            //we need to update the _raw object (which is already inside _collection._list
            //with the enumerable properties in Item
            this.id = this._itemId;
            angular.extend(this._raw,this);
            localStorage.set(this._collection._collectionKey,this._collection._list);
            return delayResult(this);
        }
        Item.prototype.remove = function(){
            for (var i=0; i < this._collection._list.length;i++){
                if (this._collection._list[i].id == this._itemId){
                    var obj = this._collection._list[i];
                    this._collection._list.splice(i,1);
                    localStorage.set(this._collection._collectionKey,this._collection._list)
                    return delayResult(obj._raw);
                }
            }
        }
        var extensions = {};
        this.all = function(collectionKey){
            return new Collection(collectionKey)
        }
        this.one = function(collectionKey,itemId){
            return {
                get: function(){
                    var collection = new Collection(collectionKey);
                    return collection.getList().then(function(list){
                        for (var i=0; i < list.length;i++){
                            if (list[i].id == itemId){
                                return list[i];
                            }
                        }
                        return new Error('could not find obj with Id ' + this.itemId);
                    })
                }
            }
        }
        this.extendModel = function(route,fn){
            extensions[route] = (extensions[route] || []).push(fn);
        }
    })