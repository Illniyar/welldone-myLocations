angular.module('categories.page',['ui.router','ct.ui.router.extras','data'])
    .provider('categoriesPageRoute',function($stateProvider){
        this.load = function(parent){
            $stateProvider.state(parent + '.categories',{
                url:'/category',
                views:{
                    'categories':{
                        templateUrl:'templates/pages/categories.html',
                        controller:'categoriesCtrl'
                    }
                },
                resolve: {
                    categories:function(data){
                        return data.getCategories();
                    }
                },
                deepStateRedirect: true,
                sticky: true
            })
        }
        this.$get = function(){};
    })
    .controller('categoriesCtrl',function($scope,categories){
        $scope.categories = categories;
        $scope.newCategory = null;
        function setIsUpdating(category,value){
            if (value === undefined){
                value = true;
            }
            if (category._updating !== undefined){
                category._updating = value;
            } else {
                Object.defineProperty(category,'_updating',{
                    value:value,
                    enumerable:false,
                    writable:true
                })
            }
        }
        $scope.addCategory = function(){
            if (!$scope.newCategory){
                $scope.newCategory = {}
            }
        }
        $scope.removeNewCategory = function(){
            $scope.newCategory = {};
        }
        $scope.addNewCategoryToCollection = function(){
            setIsUpdating($scope.newCategory,true);
            categories.post($scope.newCategory).then(function(wrappedCategory){
                $scope.categories.push(wrappedCategory);
                $scope.newCategory = null;
            })
        }
        $scope.updateCategory = function(category){
            setIsUpdating(category,true);
            category.put().then(function(){
                setIsUpdating(category,false);
            });
        }
        $scope.removeCategory = function(category){
            setIsUpdating(category,true);
            category.remove().then(function(){
                for (var i=0; i < $scope.categories.length;i++) {
                    if ($scope.categories[i] == category) {
                        $scope.categories.splice(i,1);
                    }
                }
            })
        }

    })