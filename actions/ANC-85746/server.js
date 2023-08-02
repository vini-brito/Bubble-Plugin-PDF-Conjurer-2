function(properties, context) {

	const { 
        prev_configs, 
        table_name, 
        data_source, 
        column_header = '',
        header_style,
        field_of_thing,
        column_width,
        column_style,
    } = properties;
    
    const fetch = require('node-fetch');
    
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
	
    if (!configs.repeatedTables[table_name]) {
        throw new Error(`It wasn't possible to find the table name ${table_name}`);
    }
    
    const bodyOptions = {};
    const headerOptions = {};
    
    if (column_style) bodyOptions.style = column_style;
    if (header_style) headerOptions.style = header_style;
    
    // Verify if data_source is a bubble list
    const tableLength = (typeof data_source.length === 'function') ? data_source.length() : 0;
    const tableList = (typeof  data_source.get === 'function') ? data_source.get(0, tableLength) : [];
    
    function formatData(table) {
        const tableColumn = (typeof table.get === 'function') ? table.get(field_of_thing) : '';
        const column = (typeof tableColumn.get === 'function') ? tableColumn.get(0, tableColumn.length()) : [];
            
        const columnObject = column.map((line) => {
          const text = line || ' ';
          
          if (properties.parse_bbcode) {
            return { stack: parser.getParsedText(text), ...bodyOptions };
          }
            
          return { text, ...bodyOptions }
        });
            
        const headerObject = properties.parse_bbcode      
        	? { stack: parser.getParsedText(column_header), ...headerOptions } 
        	: { text: column_header, ...headerOptions };
            
        const widthsObject = column_width === 'Fit available space' ? '*' : 'auto';
        
        return {
        	columns: [columnObject],
            headers: [headerObject],
            widths: [widthsObject]
       	};
    }
    
    if (configs.repeatedTables[table_name].length === 0) {
        // It will be the first column added
        configs.repeatedTables[table_name] = tableList.map(formatData);                        
        
    } else {
        const tables = tableList.map(formatData);
        
    	configs.repeatedTables[table_name].forEach((table, index) => {
           	const { columns, headers, widths } = tables[index] || {};
           	
            if (columns && headers && widths) {
                table.columns.push(...columns);
            	table.headers.push(...headers);
            	table.widths.push(...widths);
            }
        });
    }
	
    const configurations = JSON.stringify(configs);

	return { configurations }
}