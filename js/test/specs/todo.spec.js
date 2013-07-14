(function (app) {
    'use strict';

    describe('Todo', function () {
        beforeEach(function () {
            this.model = new app.Todo
        });

        it('should set completed to false by default', function () {
            expect(this.model.get('completed')).to.be.false;
        });

        describe('.toggle', function () {
            beforeEach(function () {
                // Prevent sync from doing it's normal thing
                // when `save` is called
                this.syncStub = sinon.stub(app.Todo.prototype, "sync");
                this.model = new app.Todo()
            });

            afterEach(function () {
                app.Todo.prototype.sync.restore();
            });

            it('should call save', function () {
                this.model.toggle();
                expect(this.syncStub).to.have.been.calledOnce;
            });

            it('should set completed to it\'s opposite state', function () {
                this.model.toggle();
                expect(this.model.get('completed')).to.be.true;

                this.model.toggle();
                expect(this.model.get('completed')).to.be.false;
            });
        });
    });
})(app || {});