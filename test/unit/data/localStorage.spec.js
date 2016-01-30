describe('localStorage',function(){
    beforeEach(function(){
        window.localStorage.clear();
        module("localStorage");
    })
    it('should retrieve item in json format',inject(function(localStorage){
        localStorage.set('item',{key:"myValue"});
        var res = localStorage.get('item');
        expect(res).to.deep.equal({key:"myValue"});
    }))
    it('should handle undefined values',inject(function(localStorage){
        localStorage.set('item',undefined);
        var res = localStorage.get('item');
        expect(res).to.equal(undefined);
    }))
    it('should handle null values',inject(function(localStorage){
        localStorage.set('item',null);
        var res = localStorage.get('item');
        expect(res).to.equal(null);
    }))
    it('should handle missing values',inject(function(localStorage){
        var res = localStorage.get('item');
        expect(res).to.equal(undefined);
    }))
    it('should allow deleting items',inject(function(localStorage){
        localStorage.set('item',{myItem:"myValue"});
        localStorage.delete('item');
        var res = localStorage.get('item');
        expect(res).to.equal(undefined);
    }))
})