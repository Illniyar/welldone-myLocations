describe('categories.page',function(){
    beforeEach(function(){
        module('categories.page','data.test.helper','test.utils');
    })
    it('should allow adding a new category to an empty list',inject(function(dataTestHelper,testUtils,$timeout){
        var scope = testUtils.controller('categoriesCtrl',{
            categories:dataTestHelper.mockCollection([])}
        ).scope;
        expect(scope.categories).to.deep.equal([]);
        scope.addCategory();
        scope.newCategory.name = 'newName';
        scope.addNewCategoryToCollection();
        expect(scope.newCategory._updating).to.be.ok;
        $timeout.flush();
        expect(scope.newCategory).to.be.null;
        expect(scope.categories.length).to.equal(1);
        expect(scope.categories[0].name).to.equal('newName');
        expect(scope.categories[0].id).to.exist;
        expect(scope.categories[0]._updating).to.be.not.ok;

    }))
    it('should allow adding a new category to an existing list',inject(function(dataTestHelper,testUtils,$timeout){
        var scope = testUtils.controller('categoriesCtrl',{
                categories:dataTestHelper.mockCollection([
                    {name:'xxx',id:1},
                    {name:'yyy',id:2}])}
        ).scope;
        expect(scope.categories).to.deep.equal([{name:'xxx',id:1},{name:'yyy',id:2}]);
        scope.addCategory();
        scope.newCategory.name = 'newName';
        scope.addNewCategoryToCollection();
        expect(scope.newCategory._updating).to.be.ok;
        $timeout.flush();
        expect(scope.newCategory).to.be.null;
        expect(scope.categories.length).to.equal(3);
        expect(scope.categories[2].name).to.equal('newName');
        expect(scope.categories[2].id).to.exist;
        expect(scope.categories[2]._updating).to.be.not.ok;
    }))
    it('should allow updating an item in place',inject(function(dataTestHelper,testUtils,$timeout){
        var scope = testUtils.controller('categoriesCtrl',{
                categories:dataTestHelper.mockCollection([
                    {name:'xxx',id:1},
                    {name:'yyy',id:2},
                    {name:'zzz',id:3}])}
        ).scope;
        scope.categories[1].name = "something new";
        scope.updateCategory(scope.categories[1]);
        expect(scope.categories[1]._updating).to.be.ok;
        $timeout.flush();
        expect(scope.categories.length).to.equal(3);
        expect(scope.categories[1].name).to.equal("something new");
        expect(scope.categories[1].id).to.equal(2);
    }))
})