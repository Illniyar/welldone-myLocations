angular.module('ratchet.modal',[])
.service('rModal',function($compile,$controller,$timeout,$templateRequest,$rootScope,$q){
        function ModalInstance(template,controller,parentScope){
            this.template = template;
            this.controllerName = controller || function(){};
            this.parentScope = parentScope || $rootScope;
            this.onFinish = $q.defer();
        }
        ModalInstance.prototype.createDOM = function(){
            this.$scope = this.parentScope || $rootScope.$new();
            this.$scope.$close = function(arg){
                this.close().then(function(){
                    this.onFinish.resolve(arg);
                }.bind(this))
            }.bind(this);
            this.$scope.$dismiss = function(arg){
                this.close().then(function(){
                    this.onFinish.reject(arg);
                }.bind(this))
            }.bind(this);
            $controller(this.controllerName,{$scope:this.$scope});
            this.modalContent = $compile(this.template)(this.$scope);
            this.modalWrapper = angular.element(document.createElement('div'));
            this.modalWrapper.addClass('modal');
            angular.forEach(this.modalContent,function(elem){
                this.modalWrapper.append(elem);
            }.bind(this))
        }
        ModalInstance.prototype.show = function(){
            var transitionEnd = $q.defer();
            this.modalWrapper.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',function(){
                transitionEnd.resolve();
            })
            this.modalWrapper.addClass('active');
            return transitionEnd.promise;
        }
        ModalInstance.prototype.hide = function(){
            var transitionEnd = $q.defer();
            this.modalWrapper.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',function(){
                transitionEnd.resolve();
            })
            this.modalWrapper.removeClass('active');
            return transitionEnd.promise;
        }
        ModalInstance.prototype.close = function(){
            return this.hide().then(function() {
                this.modalWrapper.remove();
                this.$scope.$destroy();
            }.bind(this));
        }
        this.open = function(options){
            var modalInstancePromise =$templateRequest(options.templateUrl).then(function(template){
                var modalInstance = new ModalInstance(template,options.controller,options.scope);
                modalInstance.createDOM();
                document.body.appendChild(modalInstance.modalWrapper[0]);
                $timeout(function(){
                    modalInstance.show();
                },100);
                return modalInstance;
            })
            return {
                result: modalInstancePromise.then(function(modalInstance){return modalInstance.onFinish.promise})
            };

        }
    })