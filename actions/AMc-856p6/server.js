function(properties, context) {
    
    const fetch = require('node-fetch');
    
	const { 
        prev_configs,
        table_uses_header_row, 
        header_style, 
        table_column_width, 
        table_styles, 
        table_custom_margins,
        left_margin, 
     	top_margin,
     	right_margin,
     	bottom_margin,
        page_break,
        into_multi_column,
        multi_column_width,
        multi_column_name,
        into_header,
        into_footer,
        into_background,
        table_layout,
        parse_bbcode,
        fixed_width_column_size,
        ...rest 
    } = properties;
    
    rest.use_column_1 = true;

	const configs = JSON.parse(prev_configs);
    
    const fonts = { ...configs.defaultFonts, ...configs.addedFonts };
    
    const parserURL = 'https://meta-l.cdn.bubble.io/f1688082896800x500622453357242560/bbcodeparser_fixedcode_v5_SS.js';
      
    const parser = context.async((callback) => {
      fetch(parserURL)
        .then((response) => response.text())
        .then((file) => {
          eval(file);
          	
          callback(null, getParser(
            fonts, 
            (imageName, link) => {
              configs.addedImages[imageName] = link;
            }, 
            (err) => {
              console.error(err);
            }, 
            'code', 
            'quote'
          ));
      	})
        .catch((err) => {
          callback(err, null);
        });
    });
    
    // Helpers
    const isAColumnPropertyKey = (key) => key.startsWith('column_header') || key.startsWith('column_content') || key.startsWith('use_column');
    
    const isAUsedColumn = (property) => {
        const [columnNumber] = property.match(/\d+/g);
        return rest[`use_column_${columnNumber}`] && !property.startsWith('use_column');
    };
    
    const getUsedColumnsProperties = (result, property) => {
        let value = rest[property];
        
        if (!value) {
            value = property.startsWith('column_content') ? [] : '';
        } else if (typeof value.get === 'function') {
           	value = value.get(0, value.length());
        }
        
        return { ...result, [property]: value };
    }

    // Filter properties to get Columns properties
    
    const colunsInfo = Object.keys(rest).filter(isAColumnPropertyKey).sort().sort((a, b) => {
        const [firstNumber] = a.match(/\d+/);
        const [secondNumber] = b.match(/\d+/);
        
        return Number(firstNumber) - Number(secondNumber);
    });
    	
    const desirableColumns = colunsInfo.filter(isAUsedColumn).reduce(getUsedColumnsProperties, {});
    
    // Table options
    
    const tableLayouts = {
        'No Borders': 'noBorders',
        'Header Line Only': 'headerLineOnly',
        'Light Horizontal Lines': 'lightHorizontalLines',
        'Strong Outer Border': 'strongOuterBorder',
        'Zebra': 'zebra',
        'Light Horizontal Lines Without Header': 'lightHorizontalLinesWithoutHeader',
    }
    
    const tableOptions = {};
    const headerOptions = {};
    const bodyOptions = {};
    
    if (header_style && configs.docDefinition.styles[header_style]) headerOptions.style = header_style;
    if (table_styles && configs.docDefinition.styles[table_styles]) bodyOptions.style = table_styles;
    
    if (table_custom_margins) tableOptions.margin = [left_margin, top_margin, right_margin, bottom_margin];
    if (table_layout !== 'Standard') tableOptions.layout = tableLayouts[table_layout];
    if (page_break !== 'Unspecified') tableOptions.pageBreak = page_break.toLowerCase();
      
    // Table properties
    
    const getColumnsProperties = (desirableColumns, property) => Object.keys(desirableColumns).filter((key) => key.startsWith(property)).map((key) => desirableColumns[key]);
    
    const tableHeaders = getColumnsProperties(desirableColumns, 'column_header')
    	.map((column) => { 
        	if (!column) column = ' ';
            
            if (parse_bbcode) {
                return { stack: parser.getParsedText(column), ...headerOptions };
            }
            
            return { text: column, ...headerOptions };
        });
    
  	const tableContents = getColumnsProperties(desirableColumns, 'column_content');

    const headerRows = table_uses_header_row ? 1 : 0;
    
    const numberOfColumns = tableContents.length;
    
    const eachColumnNumberOfLines = tableContents.map((column) => column.length);
    
    const maxNumberOfLines = Math.max(...eachColumnNumberOfLines);
    
    const widths = new Array(numberOfColumns).fill(table_column_width === 'Fit available space' ? '*' : 'auto');
    
    const body = [];
    
    if (table_uses_header_row) body.push(tableHeaders);
    
    // Make the table lines
    for (let i = 0; i < maxNumberOfLines; i ++) {
    	const line = tableContents.map((column) => {
            let content = column[i];
            
            if (!content) content = ' ';
            
            if (parse_bbcode) {
                return { stack: parser.getParsedText(content), ...bodyOptions };
            }
            
            return { text: String(content), ...bodyOptions };
        });
        
        body.push(line);
    }
    
    const table = {
        headerRows,
        widths,
        body,
    };
    
    const tableObject = { table, ...tableOptions };
    
  //  if (multi_column_width === 'Fit available space') tableObject.width = '*';
  //  if (multi_column_width === 'Fit content') tableObject.width = 'auto';
    
      
       
          if (multi_column_width === 'Fit available space') {

			tableObject.width = "*";

		} else if (multi_column_width === "Fit content") {

			tableObject.width = "auto";

		} else if (multi_column_width === "Fixed width") {

			tableObject.width = fixed_width_column_size;

		}
      
  
    
    
    
    
    
    
    if (into_multi_column && multi_column_name && configs.multiColumns[multi_column_name]) {
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