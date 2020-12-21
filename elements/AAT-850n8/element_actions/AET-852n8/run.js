function(instance, properties, context) {

	// composeInMe is an array of objects and we push a new object into it, each object is an element created in the pdf


	// here we bring it into existence if it doesn't exists yet

	if (instance.data.composeInMe === undefined) {
		instance.data.composeInMe = [];
	}

	// same as above	
	if (instance.data.multiColumnObjectHolder === undefined) {
		instance.data.multiColumnObjectHolder = [];
	}

	if (properties.being_repeated) {

		// initialize the array that will hold this multi column's instances
		instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`][`${properties.multiColumnName}`] = [];

		// creates the instances and push them so later they can receive the element
		for (i = 0; i < instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].howManyIterations; i++) {

			let currentMultiColumn = {
				pageBreak: properties.page_break.toLowerCase(),
				columns: [],
			};

			instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`][`${properties.multiColumnName}`].push(currentMultiColumn);

		}
	}
	else {

		// here we capture whatever the user (app maker) has inputed into the workflow actions into an object

		instance.data.multiColumnObjectHolder[`${properties.multiColumnName}`] = {
			pageBreak: properties.page_break.toLowerCase(),
			columns: [],
		};

		// we don't push this object inside composeInMe now because first we have to push some element objects (texts tables images etc) into the columns array
	}




}