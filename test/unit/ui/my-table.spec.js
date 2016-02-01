describe('ui.myTable',function(){
    describe('myTable directive',function(){
        beforeEach(function(){
            module('ui.myTable','templates','test.utils');
        })
        it('should display all items given',inject(function(testUtils){
            var options = {columns:[
                {key:"col1",name:"thing"},
                {key:"col2",name:"other"}]
            };
            var items = [
                {col1:"top",col2:"topCol2",id:1},
                {col1:"below",col2:"belowCOl2",id:2}]
            var dir = testUtils.compile(
                '<my-table items="items" options="options"></my-table>',
                {scope:{options:options,items:items}});
            expect(dir.find('.header span:first-child').text().trim()).to.equal('thing');
            expect(dir.find('.header span:nth-child(2)').text().trim()).to.equal('other');

            expect(dir.find('.content-item span:first-child')[0].textContent.trim()).to.equal('top');
            expect(dir.find('.content-item span:nth-child(2)')[0].textContent.trim()).to.equal('topCol2');

            expect(dir.find('.content-item span:first-child')[1].textContent.trim()).to.equal('below');
            expect(dir.find('.content-item span:nth-child(2)')[1].textContent.trim()).to.equal('belowCOl2');
        }))
        it('should mark item as active when clicked',inject(function(testUtils){
            var options = {columns:[
                {key:"col1",name:"thing"},
                {key:"col2",name:"other"}]
            };
            var items = [
                {col1:"top",col2:"topCol2",id:1},
                {col1:"below",col2:"belowCOl2",id:2}]
            var dir = testUtils.compile(
                '<my-table items="items" options="options" choice="currItem"></my-table>',
                {scope:{options:options,items:items}});
            expect(dir.find('.content-item ')[0].className).to.not.contain('active');
            expect(dir.scope.currItem).to.be.not.ok;
            dir.clickOn(dir.find('.content-item span:first-child')[0]);
            dir.scope.$apply();
            expect(dir.find('.content-item')[0].className).to.contain('active');
            expect(dir.scope.currItem).to.equal(items[0]);

        }))
    })

})