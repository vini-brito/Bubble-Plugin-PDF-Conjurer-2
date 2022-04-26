function(properties, context) {

	const { 
        prev_configs, 
        multi_column_name, 
        columns_gap, 
        page_break, 
        being_repeated, 
        repeating_structure_name 
    } = properties;

	// Load configurations
    const configs = JSON.parse(prev_configs);
    
    const options = {};
    if (page_break !== 'Unspecified') options.pageBreak = page_break.toLowerCase();
    if (columns_gap) options.columnGap = columns_gap;
    
    const columnObject = { columns: [], ...options };
    
    if (being_repeated) {
        if (!repeating_structure_name) {
            throw new Error('Please remember to insert the repeating structure name');
        }
        
        if (!configs.repeatedStructures[repeating_structure_name]) {
            throw new Error(`It wasn't possible to find the repeating structure name ${repeating_structure_name}`);
        }
        
        const numberOfItems = configs.repeatedStructures[repeating_structure_name].length;
        
        configs.repeatedColumns[multi_column_name] = new Array(numberOfItems).fill('').map(() => columnObject);
        
    } else {
        configs.multiColumns[multi_column_name] = columnObject;
    }    
    
    // Return configurations
	const configurations = JSON.stringify(configs);
    
    return { configurations };
    
}