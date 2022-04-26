function(properties, context) {

	const { prev_configs } = properties;
    
    const configs = JSON.parse(prev_configs);
    
    
    const configurations = JSON.stringify(configs);
  
	return { configurations };

}