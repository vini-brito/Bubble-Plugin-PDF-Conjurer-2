function(properties, context) {

	const { prev_configs, font_name, normal, bold, italics, bolditalics } = properties;
    
    const configs = JSON.parse(prev_configs);
    
    configs.addedFonts[font_name] = { normal, bold, italics, bolditalics };
    
    const configurations = JSON.stringify(configs);
    
    return { configurations };

}