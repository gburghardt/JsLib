Model.Persistence = {

	prototype: {

		destroyed: false,

		newRecord: true,

		persisted: false

	}

};

Model.Base.include(Model.Persistence);
