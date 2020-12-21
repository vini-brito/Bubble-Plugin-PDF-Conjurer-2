function(instance, properties, context) {


    // here we capture whatever the user (app maker) has inputed into the workflow actions into an object
    
    instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`] = {};

	
	instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].elements = []; 

	instance.data.repeatingStructureObjectsHolder[`${properties.repeating_structure_name}`].howManyIterations = properties.iterations_count; 



    


}