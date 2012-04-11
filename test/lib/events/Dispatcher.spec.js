describe("events.Dispatcher", function() {
	describe("subscribe", function() {
		beforeEach(function() {
			this.dispatcher = new events.Dispatcher();
			this.subscriber = {};
		});

		it("subscribes to an event", function() {
			this.dispatcher.subscribe("foo", this.subscriber, "handleFoo");
			expect(this.dispatcher.subscribers.foo).toBeArray();
			expect(this.dispatcher.subscribers.foo.length).toEqual(1);
		});

		it("defaults to handleEvent when no method is provided", function() {
			this.dispatcher.subscribe("foo", this.subscriber);
			expect(this.dispatcher.subscribers.foo).toBeArray();
			expect(this.dispatcher.subscribers.foo.length).toEqual(1);
			expect(this.dispatcher.subscribers.foo[0].method).toEqual("handleEvent");
		});

		it("subscribes multiple objects to the same event", function() {
			this.dispatcher.subscribe("foo", {}, "handleFoo");
			this.dispatcher.subscribe("foo", {}, "handleFoo");
			expect(this.dispatcher.subscribers.foo).toBeArray();
			expect(this.dispatcher.subscribers.foo.length).toEqual(2);
		});

		it("subscribes the same object to the same event multiple times", function() {
			this.dispatcher.subscribe("foo", this.subscriber, "handleFoo");
			this.dispatcher.subscribe("foo", this.subscriber, "handleFoo");
			expect(this.dispatcher.subscribers.foo).toBeArray();
			expect(this.dispatcher.subscribers.foo.length).toEqual(2);
			expect(this.dispatcher.subscribers.foo[0]).toEqual(this.dispatcher.subscribers.foo[1]);
		});
	});

	describe("unsubscribe", function() {
		beforeEach(function() {
			this.dispatcher = new events.Dispatcher();
			this.subscriber = {};
		});

		it("unsubscribes an object from a single event", function() {
			this.dispatcher.subscribe("foo", this.subscriber, "handleFoo");
			expect(this.dispatcher.subscribers.foo.length).toEqual(1);
			this.dispatcher.unsubscribe("foo", this.subscriber);
			expect(this.dispatcher.subscribers.foo.length).toEqual(0);
		});

		it("unsubscribes an object subscribed more than once to the same event", function() {
			this.dispatcher.subscribe("foo", this.subscriber, "handleFoo");
			this.dispatcher.subscribe("foo", this.subscriber, "handleFoo");
			this.dispatcher.unsubscribe("foo", this.subscriber);
			expect(this.dispatcher.subscribers.foo.length).toEqual(0);
		});
	});

	describe("publish", function() {
		beforeEach(function() {
			this.dispatcher = new events.Dispatcher();

			this.badSubscriber = {
				boo: function(event) {
					throw new Error("Intentional error, please ignore");
				}
			};

			this.goodSubscriber = {
				called: false,

				yay: function(event) {
					this.called = true;
				}
			};
		});

		it("returns false when there are no subscribers", function() {
			expect(this.dispatcher.publish("noSubscribers", {})).toBeFalse();
		});

		describe("when subscribers throw errors", function() {
			describe("and a logger exists", function() {
				events.Dispatcher.logger = console;

				it("catches errors thrown by subscribers", function() {
					this.dispatcher.subscribe("throwsAnError", this.badSubscriber, "boo");
					this.dispatcher.publish("throwsAnError");
				});

				it("does not stop propagating to other subscribers", function() {
					this.dispatcher.subscribe("throwsAnError", this.badSubscriber, "boo");
					this.dispatcher.subscribe("throwsAnError", this.goodSubscriber, "yay");
					expect(this.dispatcher.publish("throwsAnError")).toBeTrue();
					expect(this.goodSubscriber.called).toBeTrue();
				});
			});
		});

		describe("and a logger does not exist", function() {
			it("throws an error", function() {
				this.dispatcher.subscribe("throwsAnError", this.badSubscriber, "boo");
				expect(function() {this.dispatcher.publish("throwsAnError");}).toThrowError();
			});

			it("stops propagating to other subscribers", function() {
				this.dispatcher.subscribe("throwsAnError", this.badSubscriber, "boo");
				expect(function() {this.dispatcher.publish("throwsAnError");}).toThrowError();
				this.dispatcher.subscribe("throwsAnError", this.goodSubscriber, "yay");
				expect(this.goodSubscriber.called).toBeFalse();
			});
		});

		it("does not propagate a cancelled event", function() {
			var MockSubscriber = function(cancelEvent) {
				this.cancelEvent = !!cancelEvent;
			};
			MockSubscriber.prototype = {
				called: false,

				respond: function(event) {
					this.called = true;

					if (this.cancelEvent) {
						event.cancel();
					}
				}
			};

			var subscriber1 = new MockSubscriber(true);
			var subscriber2 = new MockSubscriber();
			this.dispatcher.subscribe("foo", subscriber1, "respond");
			this.dispatcher.subscribe("foo", subscriber2, "respond");

			this.dispatcher.publish("foo");
			expect(subscriber1.called).toBeTrue();
			expect(subscriber2.called).toBeFalse();
		});
	});
});
