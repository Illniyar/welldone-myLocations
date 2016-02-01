angular.module('mobile.form',[])
/**
 * directive to get tabbing between inputs in a form working
 * note that multiple directives can act on the same element type
 */
.directive('form',function(){
        return {
            restrict:'E',
            link: {
                pre:function(scope,elem) {
                    var ngFormCtrl = elem.controller('form');
                    ngFormCtrl.$$mobileElements = [];
                    ngFormCtrl.$mobileAddInput = function (elem) {
                        var index = ngFormCtrl.$$mobileElements.length;
                        ngFormCtrl.$$mobileElements.push(elem);
                        elem.on('keydown', function (e) {
                            //if press enter, move to next tab, otherwise submit form
                            if ((e.which == 13 || e.keyCode == 13)
                                && ngFormCtrl.$$mobileElements.length > index + 1) {
                                var nextElem = ngFormCtrl.$$mobileElements[index + 1][0];
                                if (nextElem.nodeName.toLowerCase() =='input'){
                                    nextElem.focus();
                                }else if (nextElem.nodeName.toLowerCase() == 'select'){
                                    //select element doesn't show dropdown on focus,
                                    //need to trigger a mousedown event
                                    nextElem.dispatchEvent(new MouseEvent('mousedown'));
                                }
                                e.preventDefault(); //don't submit form;
                            }
                        })
                    }
                }
            }
        }
    })
    .directive('input',function(){
        return {
            restrict:'E',
            require:'^?form',
            link: function(scope,elem,attr,formCtrl){
                if (formCtrl && !(attr.disabled || attr.noTab)) {
                    formCtrl.$mobileAddInput(elem);
                }
            }
        }
    })
    .directive('select',function(){
        return {
            restrict:'E',
            require:'^?form',
            link: function(scope,elem,attr,formCtrl){
                if (formCtrl && !(attr.disabled || attr.noTab)) {
                    formCtrl.$mobileAddInput(elem);
                }
            }
        }
    })