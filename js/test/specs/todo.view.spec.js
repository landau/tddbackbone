(function (app) {
    'use strict';

    describe("Todo View", function () {
        beforeEach(function () {
            this.model = new app.Todo();
            this.view = new app.TodoView({ model: this.model });
        });

        it("should be a list tag", function () {
            expect(app.TodoView.prototype.tagName).to.equal("li");
        });

        describe(".initialize", function () {
            it("should call listenTo with change", function () {
                var spy = sinon.spy(this.view, "listenTo");
                this.view.initialize();
                expect(spy).to.be.calledWithExactly(this.model, "change", this.view.render);
            });

            it("should call listenTo with destroy", function () {
                var spy = sinon.spy(this.view, "listenTo");
                this.view.initialize();
                expect(spy).to.be.calledWithExactly(this.model, "destroy", this.view.remove);
            });

            it("should call listenTo with visible", function () {
                var spy = sinon.spy(this.view, "listenTo");
                this.view.initialize();
                expect(spy).to.be.calledWithExactly(this.model, "visible", this.view.toggleVisible);
            });
        });

        describe("render", function () {
            it("should call toJSON with a model", function () {
                var spy = sinon.spy(this.model, "toJSON");
                this.view.render();
                expect(spy).to.be.calledOnce;
            });

            it("should call template with a model", function () {
                var spy = sinon.spy(this.view, "template");
                this.view.render();
                expect(spy).to.be.calledWithExactly(this.model.toJSON());
            });

            it("should call `html` on the view's `$el`", function () {
                var spy = sinon.spy(this.view.$el, "html");
                var compiled = this.view.template(this.model.toJSON());
                this.view.render();
                expect(spy).to.be.calledWithExactly(compiled);
            });

            it("should call toggleClass", function () {
                var spy = sinon.spy(this.view.$el, "toggleClass");
                this.view.render();
                expect(spy).to.be.calledWithExactly("completed", this.model.get("completed"));
            });

            it("should call toggleVisible", function () {
                var spy = sinon.spy(this.view, "toggleVisible");
                this.view.render();
                expect(spy).to.be.calledOnce;
            });

            it("should call `.$` with the `.edit` selector", function () {
                var spy = sinon.spy(this.view, "$");
                this.view.render();
                expect(spy).to.be.calledWithExactly(".edit");
            });

            it("should set the `$input` instance property", function () {
                this.view.render();
                var $edit = this.view.$(".edit");
                expect(this.view.$input[0]).to.equal($edit[0]);
            });

            it("should return the instance", function () {
                var spy = sinon.spy(this.view, "render");
                this.view.render();
                expect(spy.alwaysReturned(this.view)).to.be.true;
            });
        });

        describe("toggleVisible", function () {
            it("should call toggleClass", function () {
                var spy = sinon.spy(this.view.$el, "toggleClass");

                // Don't test functionality of other user defined methods
                var stub = sinon.stub(this.view, "isHidden", function () {
                    return true;
                });

                this.view.toggleVisible();
                expect(spy).to.be.calledWithExactly("hidden", true);
            });
        });

        describe("isHidden", function () {
            it("should call `get` on a model", function () {
                var spy = sinon.spy(this.model, "get");
                this.view.isHidden();
                expect(spy).to.be.calledWithExactly("completed");
            });

            it("should return true if filter is active and isCompleted is true", function () {
                // TodoFilter is in router, blech
                this.model.set("completed", true);
                app.TodoFilter = "active";
                expect(this.view.isHidden()).to.be.true;
            });

            it("should return false if filter is active and isCompleted is false", function () {
                // TodoFilter is in router, blech
                this.model.set("completed", false);
                app.TodoFilter = "active";
                expect(this.view.isHidden()).to.be.false;
            });

            it("should return true if filter is completed and isCompleted is false", function () {
                // TodoFilter is in router, blech
                this.model.set("completed", false);
                app.TodoFilter = "completed";
                expect(this.view.isHidden()).to.be.true;
            });

            it("should return false if filter is completed and isCompleted is true", function () {
                // TodoFilter is in router, blech
                this.model.set("completed", true);
                app.TodoFilter = "completed";
                expect(this.view.isHidden()).to.be.false;
            });
        });

        describe("toggleCompleted", function () {
            it("should call `toggle` on a model", function () {
                // We don't care about default behavior
                var stub = sinon.stub(this.model, "toggle");

                this.view.toggleCompleted();
                expect(stub).to.be.calledOnce;
            });
        });

        describe("edit", function () {
            it("should call `addClass` `editing`", function () {
                // We could observe the view itself gets the view
                // but what we are really testing is if this
                // method is called from an expecting option
                // passing a specific value
                var spy = sinon.spy(this.view.$el, "addClass");
                this.view.render();
                this.view.edit();
                expect(spy).to.be.calledWithExactly("editing");
            });

            it("should call `focus` on `$input`", function () {
                // Must call render to populate element for 
                // `$input`
                this.view.render();

                var spy = sinon.spy(this.view.$input, "focus");
                this.view.edit();
                expect(spy).to.be.calledOnce;
            });
        });

        describe("close", function () {
            beforeEach(function () {
                // View must be rendered to call from
                // `$input`
                this.view.render();
            });

            it("should get call val on `$input`", function () {
                this.view.render();
                var spy = sinon.spy(this.view.$input, "val");
                this.view.close();
                expect(spy).to.be.calledOnce;
            });

            it("should call save if there is a value in `$input`", function () {
                // Use stub to prevent normal `save` from occuring
                var stub = sinon.stub(this.model, "save");
                this.view.render();

                var valStub = sinon.stub(this.view.$input, "val", function () {
                    return "foobar";
                });

                this.view.close();

                expect(stub).to.be.calledOnce;
            });

            it("should call clear if there is no value", function () {
                this.view.render();

                var valStub = sinon.stub(this.view.$input, "val", function () {
                    return "";
                });

                var spy = sinon.spy(this.view, "clear");
                this.view.close();
                expect(spy).to.be.calledOnce;
            });

            it("should remove class `editing`", function () {
                var spy = sinon.spy(this.view.$el, "removeClass");
                this.view.close();
                expect(spy).to.be.calledWithExactly("editing");
            });
        });

        describe(".updateOnEnter", function () {
            beforeEach(function () {
                window.ENTER_KEY = 13;
                // dont worry about underlyings of close method
                this.stub = sinon.stub(this.view, "close");
            });

            afterEach(function () {
                window.ENTER_KEY = void 0;
            });

            it("should call close if enter key is hit", function () {
                this.view.updateOnEnter({ which: 13 });
                expect(this.stub).to.be.calledOnce;
            });

            // Verify that close is not called too!
            it("should not call close if non-enter key is hit", function () {
                this.view.updateOnEnter({ which: 10 });
                expect(this.stub).to.not.be.calledOnce;
            });
        });

        describe("clear", function () {
            it("should call destroy on a model", function () {
                // stubs have spy api as well
                // prevent destroy from behaving normally
                var stub = sinon.stub(this.model, "destroy");
                this.view.clear();
                expect(stub).to.be.calledOnce;
            });
        });
    });
})(app || {});