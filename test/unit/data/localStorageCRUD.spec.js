describe('localStorageCRUD',function(){
    beforeEach(function(){
        module("localStorageCRUD",MOCK_LOCAL_STORAGE);
    })
    it('should return all items when asking for list',inject(function(localStorageCRUD,$timeout){
        var items = localStorageCRUD.all('items');
        items.post({key:'value1'});
        items.post({key:'value2'});
        items.post({key:'value3'});
        $timeout.flush();

        items.getList().then(function(res){
            expect(Objectify(res)).to.deep.have.members([
                {id:1,key:'value1'},
                {id:2,key:'value2'},
                {id:3,key:'value3'}
            ])
        });
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
    }))
    it('should allow updating items',inject(function(localStorageCRUD,$timeout){
        var items = localStorageCRUD.all('items');
        items.post({key:'value1'});
        items.post({key:'value2'});
        items.post({key:'value3'});
        $timeout.flush();
        items.getList().then(function(list){
            var item2 = list[1];
            item2.key = 'new2';
            item2.put().then(function(res){
                expect(Objectify(res)).to.deep.equal({id:2,key:'new2'})
                return localStorageCRUD.one('items',2).get().then(function(item){
                    expect(Objectify(item)).to.deep.equal({id:2,key:'new2'})
                })
            })
        })
        $timeout.flush();
        $timeout.flush();
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
    }))
    it('should allow deleting items',inject(function(localStorageCRUD,$timeout){
        var items = localStorageCRUD.all('items');
        items.post({key:'value1'});
        items.post({key:'value2'});
        items.post({key:'value3'});
        $timeout.flush();
        items.getList().then(function(list){

            var item2 = list[1];
            item2.remove().then(function(res){
                localStorageCRUD.all('items').getList().then(function(res){
                    expect(Objectify(res)).to.deep.have.members([
                        {id:1,key:'value1'},
                        {id:3,key:'value3'}
                    ])
                })
            })
        })
        $timeout.flush();
        $timeout.flush();
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
    }))
    var MOCK_LOCAL_STORAGE = function($provide){
        $provide.service('localStorage',function(){
            var local = {};
            this.get = function(key){
                return local[key];
            }
            this.set = function(key,val){
                local[key] = val;
            }
            this.delete = function(key){
                delete local[key];
            }
        })
    }
    function Objectify(obj){
        return JSON.parse(JSON.stringify(obj));
    }
})
