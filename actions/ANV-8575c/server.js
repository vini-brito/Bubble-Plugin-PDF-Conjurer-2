function(properties, context) {

	const { prev_configs, table_name } = properties;
    
    const configs = JSON.parse(prev_configs);
    
    configs.advancedTables[table_name] = {
        headers: [],
        columns: [],
        widths: [],
    }
    
	const configurations = JSON.stringify(configs);

	return { configurations };
	
}