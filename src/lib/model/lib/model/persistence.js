Model.Persistence = {

	prototype: {

		destroyed: false,

		newRecord: true

	}

};

Model.Base.include(Model.Persistence);
