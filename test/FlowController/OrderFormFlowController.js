function OrderFormFlowController() {

	FlowController.prototype.constructor.apply(this, arguments);

	this.createControllers = function() {
		this.controllers.basicInfo = new BasicInfoController("basicInfo", this);
		// this.controllers.payment = new PaymentInfoController("payment", this);
		// this.controllers.confirmation = new ConfirmationController("confirmation", this);
	};

	this.getNextActiveController = function(name, action ,data) {
		switch (name) {

		case "basicInfo":
			switch (action) {
			case "submit":
				return this.controllers.payment;
			break;

			default:
				this.close();
				return null;
			break;
			}
		break;

		case "payment":

		break;

		case "confirmation":
		break;
		}
	};

}

OrderFormFlowController.prototype = new FlowController();