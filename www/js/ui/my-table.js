angular.module('ui.myTable',[])
.directive('myTable',function(){
    return {
        restrict:'E',
        templateUrl:'templates/my-table-directive.html',
        scope: {
            items:"=",
            choice:"=?",
            options:"="
        },
        link:function($scope){
            $scope.itemsFiltered = $scope.items;
            $scope.choice = null;
            $scope.choiceIndex = undefined;
            $scope.showFilter = false;
            $scope.textFilter = "";
            $scope.toggleSort = function(key){
                if ($scope.sortKey != key){
                    $scope.sortKey = key;
                    $scope.sortDesc = true;
                } else {
                    $scope.sortDesc = !$scope.sortDesc;
                }
                $scope.applyFilter();
            }
            $scope.toggleGroupBy = function(key){
                $scope.groupBy = $scope.groupBy == key?undefined : key;
                $scope.applyFilter();
            }
            $scope.toggleTextFilter = function(key){
                $scope.showTextFilter = $scope.showTextFilter == key? undefined: key;
            }

            $scope.toggleChoice = function(item){
                $scope.choice = $scope.choice == item? null: item;
            }
            $scope.applyFilter = function(){
                //clone array, so that ng-repeat watch will trigger
                var items = $scope.items.concat();
                if ($scope.textFilter){
                    items = items.filter(function(item){
                        return item[$scope.showTextFilter].indexOf($scope.textFilter) >=0;
                    })
                }
                items = items.sort(function(a,b){
                    if ($scope.groupBy && a[$scope.groupBy] != b[$scope.groupBy]) {
                        var groupA = a[$scope.groupBy], groupB = b[$scope.groupBy];
                        return $scope.sortDesc ? groupA > groupB : groupB > groupA;
                    }
                    a = a[$scope.sortKey], b = b[$scope.sortKey];
                    return $scope.sortDesc ? a > b : b > a;

                })
                $scope.itemsFiltered = items;
            }
            $scope.$watch('textFilter',$scope.applyFilter.bind($scope));

        }
    }
})