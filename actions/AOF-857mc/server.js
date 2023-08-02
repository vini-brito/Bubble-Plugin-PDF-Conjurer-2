function(properties, context) {

	const { 
        prev_configs, 
        table_name, 
        table_layout, 
        page_break,
        table_custom_margins,
        left_margin,
        top_margin,
        right_margin,
        bottom_margin,
        into_multi_column,
        multi_column_name,
        this_column_width,
        into_header,
        into_footer,
        into_background,
        fixed_width_column_size,
    } = properties;

	const configs = JSON.parse(prev_configs);
    
    const tableLayouts = {
        'No Borders': 'noBorders',
        'Header Line Only': 'headerLineOnly',
        'Light Horizontal Lines': 'lightHorizontalLines',
        'Strong Outer Border': 'strongOuterBorder',
        'Zebra': 'zebra',
        'Light Horizontal Lines Without Header': 'lightHorizontalLinesWithoutHeader'
    }
    
    const options = {};
    
    if (table_layout !== 'Standard') options.layout = tableLayouts[table_layout];
    if (page_break !== 'Unspecified') options.pageBreak = page_break.toLowerCase();
    if (table_custom_margins) options.margin = [left_margin, top_margin, right_margin, bottom_margin];
    

    
    if (into_multi_column || into_header || into_footer) {
        
       // options.width = this_column_width === 'Fit available space' ? '*' : 'auto';
        
        
        if (this_column_width === 'Fit available space') {

			options.width = "*";

		} else if (this_column_width === "Fit content") {

			options.width = "auto";

		} else if (this_column_width === "Fixed width") {

			options.width = fixed_width_column_size;

		}
        
        
        
    }
    
    const { [table_name]: tableConfigs } = configs.advancedTables;
    
    if (!tableConfigs) throw new Error(`It wasn't possible to find the table name ${table_name}`);
    
    const { headers, columns, widths } = tableConfigs;
    
    const headerRows = 1;
    
    const columnsLines = columns.map((column) => column.length);
    const maxNumberOfLines = Math.max(...columnsLines);
    
    const body = [headers];
    
    for (let i = 0; i < maxNumberOfLines; i++) {
        const line = columns.map((column) => {
            const value = column[i] || '';
            
            return value;
        });
        
        body.push(line);
    }
        
    const table = { headerRows, widths, body };
       
    const tableObject = { table, ...options }
    
    if (multi_column_name && configs.multiColumns[multi_column_name]) {
        configs.multiColumns[multi_column_name].columns.push(tableObject);
    } else if (into_header && configs.headerOptions) {
        configs.headerOptions.elements.push(tableObject);
    } else if (into_footer && configs.footerOptions) {
        configs.footerOptions.elements.push(tableObject);
    } else if (into_background) {
        configs.docDefinition.background.push(tableObject);
    } else {
    	configs.docDefinition.content.push(tableObject);
    }
    
    const configurations = JSON.stringify(configs);
    
    return { configurations };

}