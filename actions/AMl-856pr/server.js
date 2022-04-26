function(properties, context) {

	const { prev_configs, repeating_structure_name } = properties;
    
    const configs = JSON.parse(prev_configs);
     
    const { [repeating_structure_name]: structure } = configs.repeatedStructures;
    
    if (structure) {
        structure.forEach((repeating) => {
            const elements = repeating.filter(Boolean);
            
            configs.docDefinition.content.push(...elements)
        });
    } else {
        throw new Error(`It wasn't possible to find the repeating structure name ${repeating_structure_name}`)
    }
    
    const configurations = JSON.stringify(configs);
    
    return { configurations };

}