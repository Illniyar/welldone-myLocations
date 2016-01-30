angular.module('map',['ng'])
    .provider('map',function(){
        var maps = null;
        var mapElement = null;
        var mapElementApi = null;
        window.onGoogleMapsLoaded = function(){
            maps = window.google.maps;
            mapElement = document.createElement('div');
            mapElement.id ="map-content";
            mapElement.style.visibility= 'hidden';
            document.body.appendChild(mapElement);
            mapElementApi = new maps.Map(mapElement,{
                center:{lat:0,lng:0},
                zoom:8
            });
        };
        this.load = function(key){
            var scriptTag = document.createElement('script');
            scriptTag.setAttribute("type","text/javascript");
            scriptTag.setAttribute("src",'https://maps.googleapis.com/maps/api/js?key=' + key + '&callback=onGoogleMapsLoaded');
            document.body.appendChild(scriptTag);
        };
        this.$get = function($q){
            function checkLoaded(){
                if (!maps){
                    throw new Error('map has not loaded yet');
                }
            }
            var geocoder = null;
            return new function Map(){
                this.geocode = function(address){
                    checkLoaded();
                    if(!geocoder){
                        geocoder = new maps.Geocoder();
                    }
                    var deferred = $q.defer();
                    geocoder.geocode({address:address},function(response){
                        if ( response && response && response.length > 0){
                            var location = response[0].geometry.location;
                            deferred.resolve({
                                lat: location.lat(),
                                lng: location.lng()
                            })
                        } else {
                            deferred.resolve(null);
                        }
                    });
                    return deferred.promise;
                };

                function MapObj(){
                    mapElement.style.visibility= 'initial';
                    var marker = null;
                    this.onClick = function(cb){
                        var listener = mapElementApi.addListener('click',cb);
                        return function deregister(){
                            maps.event.removeListener(listener);
                        }
                    };
                    this.setMarker= function(coords){
                        if (!marker){
                            marker = new maps.Marker({
                                position:coords,
                                map:mapElementApi
                            })
                        }else {
                            marker.setPosition(coords);
                        }
                    };
                    this.getMarkerPosition= function(){
                        if(marker){
                            var latlng = marker.getPosition();
                            return {
                                lat:latlng.lat(),
                                lng:latlng.lng()
                            }
                        } else {
                            return null;
                        }
                    };
                    this.setCenter = function(coords){
                        mapElementApi.setCenter(coords);
                    };
                    this.attachToElement = function(newParent){
                        newParent.appendChild(mapElement);
                    };
                }
                var mapObj = null;
                this.attachMapToElement = function(newElement,coords){
                    if (!mapObj){
                        mapObj = mapObj || new MapObj(newElement,coords);
                    }
                    mapObj.attachToElement(newElement);
                    mapObj.setCenter(coords);
                    return mapObj;
                }
            };
        }
    })
    .directive('map',function(map){
        return {
            restrict:'E',
            template:'',
            scope:{
              position:"=position",
              readOnly:"=readOnly"
            },
            link: function($scope,$element){
                var  mapObj = map.attachMapToElement($element[0]);
                if ($scope.position){
                    mapObj.setMarker($scope.position);
                }
                var removeListener = mapObj.onClick(function(e){
                    if ($scope.readOnly){
                        return;
                    }
                    var newPosition = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                    };
                    mapObj.setMarker(newPosition);
                    $scope.position = newPosition;
                    $scope.$apply();
                });
                $scope.$watch('position',function(){
                    mapObj.setMarker($scope.position);
                    mapObj.setCenter($scope.position);
                });
                $scope.$on('$destroy',function(){
                    removeListener();
                });
            }

        }
    })