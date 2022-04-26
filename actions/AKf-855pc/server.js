function(properties, context) {

	const { prev_configs, multi_column_name, being_repeated, repeating_structure_name } = properties;
	
    const configs = JSON.parse(prev_configs);
    
    const { [multi_column_name]: column } = being_repeated ? configs.repeatedColumns : configs.multiColumns;
    
    if (!column) {
    	throw new Error(`It wasn't possible to find the multi column name ${multi_column_name}`);
    }
    
    if (being_repeated) {
        if (!repeating_structure_name) {
            throw new Error('Please remember to insert the repeating structure name');
        }
        
        if (!configs.repeatedStructures[repeating_structure_name]) {
            throw new Error(`It wasn't possible to find the repeating structure name ${repeating_structure_name}`);
        }
        
        configs.repeatedStructures[repeating_structure_name].forEach((element, index) => {
            const value = column[index] || '';
            
            element.push(value);
        });
    } else {        
        configs.docDefinition.content.push(column);
    }
    
    const configurations = JSON.stringify(configs);
	
	return { configurations };

}