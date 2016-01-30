angular.module('data',['localStorageCRUD'])
.service('data',function(localStorageCRUD){
        var cache = {
            categories: null,
            locations: null
        }
        this.getCategories = function(){
            return cache.categories || (cache.categories = localStorageCRUD.all('categories').getList());
        }
        this.getLocations = function(){
            return cache.locations || (cache.locations = localStorageCRUD.all('locations').getList());
        }
    })