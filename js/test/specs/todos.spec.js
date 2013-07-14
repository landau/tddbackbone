(function (app) {
    'use strict';

    describe('TodoList', function () {
        beforeEach(function () {
            this.collection = new app.TodoList
        });

        describe('.completed', function () {
            it("should return 1 completed todo", function () {
                var completedTodo = new app.Todo({completed: true});
                var incompleteTodo = new app.Todo();
                this.collection.add([completedTodo, incompleteTodo]);

                var ret = this.collection.completed();
                expect(ret.length).to.equal(1);
                expect(ret[0]).to.equal(completedTodo);
            });

        });

        describe('.remaining', function () {
            it("should return 1 todo unfinished", function () {
                var completedTodo = new app.Todo({completed: true});
                var incompleteTodo = new app.Todo();
                this.collection.add([completedTodo, incompleteTodo]);

                var ret = this.collection.remaining();
                expect(ret.length).to.equal(1);
                expect(ret[0]).to.equal(incompleteTodo);
            });
        });

        describe('.nextOrder', function () {
            it("should return 1 if length is 0", function () {
                expect(this.collection.length).to.equal(0);
                expect(this.collection.nextOrder()).to.equal(1);
            });

            // This test will fail because the order
            // property could be unset on the item
            it("should return the next ordered item number", function () {
                this.collection.add(new app.Todo);
                expect(this.collection.nextOrder()).to.equal(2);
            });
        });

        describe('.comparator', function () {
            it('should call get on a todo model', function () {
                var todo = new app.Todo();
                var spy = sinon.spy(todo, "get");
                this.collection.comparator(todo);
                expect(spy).to.have.been.calledOnce;    
                expect(spy).to.have.been.calledWithExactly("order");
            });
        });
    });
})(app || {});