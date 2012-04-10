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
		});

		it("returns false when there are no subscribers", function() {
			expect(this.dispatcher.publish("noSubscribers", {})).toBeFalse();
		});

		xit("catches errors thrown by subscribers");
		xit("does not propagate a cancelled event");
	});
});
