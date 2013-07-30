(function (app) {
    'use strict';

    describe('Todo Model', function () {
        beforeEach(function () {
            this.model = new app.Todo();
        });

        it('should set completed to false by default', function () {
            expect(this.model.get('completed')).to.be.false;
        });

        describe('.toggle', function () {
            beforeEach(function () {
                // Prevent sync from doing it's normal thing
                // when `save` is called
                this.mock = sinon.mock(app.Todo.prototype);
                this.expect = this.mock.expects('sync');
                this.model = new app.Todo();
            });

            afterEach(function () {
                this.mock.restore();
            });

            it('should call sync', function () {
                this.expect.once();
                this.model.toggle();
                this.mock.verify();
            });

            it('should set completed to it\'s opposite state', function () {
                this.expect.twice();

                this.model.toggle();
                expect(this.model.get('completed')).to.be.true;

                this.model.toggle();
                expect(this.model.get('completed')).to.be.false;
                this.mock.verify();
            });
        });
    });
})(app || {});