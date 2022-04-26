function(properties, context) {

	const { prev_configs, repeating_structure_name, iterations_count } = properties;
    
    // Load configs
    const configs = JSON.parse(prev_configs);
	
    configs.repeatedStructures[repeating_structure_name] = new Array(iterations_count).fill('').map(() => []);
    
	// Return configurations
	const configurations = JSON.stringify(configs);
	
    return { configurations };
    
}