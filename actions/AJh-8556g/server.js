function(properties, context) {

	const { 
        prev_configs, 
        style_name, 
        font_size: fontSize, 
        bold, 
        italics, 
        alignment, 
        font_name: font,
        color,
    } = properties;
	
    const configs = JSON.parse(prev_configs);
    
    function convertRGBAtoHEX(rgba) {
        const pattern = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d{1,3}))?\)/;
        
        const [match, r = 0, g = 0, b = 0] = rgba.match(pattern);
        const convertedColor = [r, g, b]
        	.map((value) => Number(value).toString(16).padStart(2, '0').toUpperCase());
        
        return '#' + convertedColor.join('');
    }

    const hexColor = color.startsWith("#") ? color : convertRGBAtoHEX(color);
    
    configs.docDefinition.styles[style_name] = { 
        color: hexColor, 
        fontSize, 
        bold, 
        italics, 
        alignment: alignment.toLowerCase(), 
        font 
    };
    
    const configurations = JSON.stringify(configs);
    
    return { configurations };
    
}